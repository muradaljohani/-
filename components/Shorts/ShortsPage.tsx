
import React, { useState, useEffect, useRef } from 'react';
import { collection, query, limit, getDocs, orderBy, db } from '../../src/lib/firebase';
import { ShortsPlayer } from './ShortsPlayer';
import { ShortsHeader } from './ShortsHeader';
import { SettingsMenu } from './SettingsMenu';
import { EffectsDrawer } from './EffectsDrawer';
import { CreateShortModal } from './CreateShortModal';
import { Loader2, ArrowRight } from 'lucide-react';
import { SEOHelmet } from '../SEOHelmet';

interface Props {
    onBack: () => void;
    onUserClick?: (userId: string) => void;
}

export const ShortsPage: React.FC<Props> = ({ onBack, onUserClick }) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false); // New State
    
    // Editor State
    const [isEditing, setIsEditing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('none');
    
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch Mixed Media Posts (Video + Image)
    const fetchShorts = async () => {
        try {
            const postsRef = collection(db, 'posts');
            
            // Get newest posts first
            const q = query(postsRef, orderBy('createdAt', 'desc'), limit(50));
            
            const snapshot = await getDocs(q);
            const mixedPosts = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter((post: any) => {
                    const hasVideo = post.type === 'video' || (post.images && post.images.some((url: string) => url.includes('.mp4') || url.includes('.webm'))) || post.videoUrl;
                    const hasImage = post.type === 'image' || (post.images && post.images.length > 0) || post.image;
                    return hasVideo || hasImage;
                });
            
            setPosts(mixedPosts);
        } catch (error) {
            console.error("Error fetching shorts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShorts();
    }, []);

    // Intersection Observer for Auto-Play
    useEffect(() => {
        const options = {
            root: containerRef.current,
            threshold: 0.6, // 60% visibility triggers change
        };

        const handleScroll = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = Number(entry.target.getAttribute('data-index'));
                    setActiveIndex(index);
                }
            });
        };

        const observer = new IntersectionObserver(handleScroll, options);
        
        const videoElements = document.querySelectorAll('.shorts-video-container');
        videoElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [posts]);

    return (
        <div className="w-full h-[calc(100vh-60px)] md:h-screen bg-black text-white font-sans flex justify-center">
            <SEOHelmet title="ميلاف شورتس | مقاطع وصور" path="/shorts" />
            
            {/* Desktop Container Wrapper */}
            <div className="relative w-full md:max-w-[450px] h-full md:border-x md:border-gray-800 bg-black overflow-hidden">
                
                {/* 1. The Floating Header (Z-Index 50) */}
                <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
                     <ShortsHeader 
                        onOpenSettings={() => setShowSettings(!showSettings)} 
                        isEditing={isEditing}
                        onToggleEditing={() => setIsEditing(!isEditing)}
                        onOpenCreate={() => setIsCreateOpen(true)}
                     />
                </div>

                {/* 2. The Settings Dropdown (Z-Index 60) */}
                {showSettings && (
                    <div className="absolute top-16 right-4 z-60">
                        <SettingsMenu onClose={() => setShowSettings(false)} />
                    </div>
                )}
                
                {/* 3. The Effects Drawer (Z-Index 60) - Controlled by Header */}
                <EffectsDrawer 
                    isOpen={isEditing}
                    activeFilter={activeFilter}
                    onSelectFilter={setActiveFilter}
                    onClose={() => setIsEditing(false)}
                />

                {/* --- BACK BUTTON (FLOATING TOP RIGHT) --- */}
                <button 
                    onClick={onBack} 
                    className="absolute top-6 right-4 z-[60] p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-colors border border-white/10 md:hidden pointer-events-auto"
                >
                    <ArrowRight className="w-5 h-5 rtl:rotate-180"/>
                </button>

                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-white"/>
                    </div>
                ) : (
                    /* 4. The Scrollable Feed (Z-Index 0) */
                    <div 
                        ref={containerRef}
                        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                    >
                        {posts.length > 0 ? (
                            posts.map((post, index) => (
                                <div 
                                    key={post.id} 
                                    data-index={index}
                                    className="shorts-video-container w-full h-full snap-start relative bg-gray-900"
                                >
                                    <ShortsPlayer 
                                        post={post} 
                                        isActive={index === activeIndex}
                                        onUserClick={onUserClick}
                                        activeFilter={activeFilter}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6">
                                <p className="text-gray-400 mb-4">لا توجد مقاطع حالياً.</p>
                                <button onClick={onBack} className="bg-white text-black px-6 py-2 rounded-full font-bold">عودة للرئيسية</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* CREATION STUDIO MODAL */}
            <CreateShortModal 
                isOpen={isCreateOpen} 
                onClose={() => {
                    setIsCreateOpen(false);
                    fetchShorts(); // Refresh feed after post
                }} 
            />
        </div>
    );
};
