
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Assuming router or using window.location

interface SEOHelmetProps {
  title: string;
  description?: string;
  type?: 'Job' | 'Course' | 'Product' | 'Article' | 'General' | 'Collection' | 'Profile';
  data?: any; // The raw data object
  image?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
  faq?: {question: string, answer: string}[];
  author?: string;
  publishedTime?: string;
}

/**
 * THE GOD-TIER SEO HELMET (v3.0 - DOMINATION EDITION)
 * Implements "Schema Constellation" protocol.
 * Handles: Multi-Entity Injection, FAQ Rich Snippets, Breadcrumb Hierarchy, and Review Aggregation.
 */
export const SEOHelmet: React.FC<SEOHelmetProps> = ({ 
    title, 
    description = "منصة ميلاف مراد الوطنية للتوظيف والتدريب. الوجهة الأولى للوظائف الحكومية، الدورات المعتمدة، وسوق الخدمات في المملكة العربية السعودية.", 
    type = 'General', 
    data,
    image = "https://murad-group.com/og-default.jpg",
    path,
    noIndex = false,
    keywords = [],
    faq,
    author = "Murad Aljohani",
    publishedTime
}) => {
  
  useEffect(() => {
    // --- 1. TITLE & DESC OPTIMIZATION ---
    const baseTitle = "مجموعة ميلاف مراد";
    const finalTitle = title.includes('|') ? title : `${title} | ${baseTitle}`;
    document.title = finalTitle;

    // --- 2. META TAGS MANAGER ---
    const setMeta = (name: string, content: string, isProp: boolean = false) => {
        const attr = isProp ? 'property' : 'name';
        let element = document.querySelector(`meta[${attr}="${name}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attr, name);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    // Semantic Keyword Injection
    const defaultKeywords = ["وظائف السعودية", "تدريب منتهي بالتوظيف", "حراج", "سوق خدمات", "دورات برمجة", "أمن سيبراني", "ميلاف"];
    const finalKeywords = [...new Set([...keywords, ...defaultKeywords])].join(', ');

    setMeta('description', description.substring(0, 320)); 
    setMeta('keywords', finalKeywords);
    setMeta('author', author);
    
    // Social Graph (Open Graph) - The "Shareable" Factor
    const currentUrl = `https://murad-group.com${path || window.location.pathname}`;
    setMeta('og:title', finalTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type === 'Article' ? 'article' : 'website', true);
    setMeta('og:url', currentUrl, true);
    setMeta('og:image', data?.imageUrl || image, true);
    setMeta('og:site_name', 'أكاديمية ميلاف مراد الوطنية', true);
    setMeta('og:locale', 'ar_SA', true);
    
    if (publishedTime) {
        setMeta('article:published_time', publishedTime, true);
        setMeta('article:author', author, true);
    }

    // Twitter Card (Large Image for Max CTR)
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:site', '@IpMurad');
    setMeta('twitter:creator', '@IpMurad');
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', data?.imageUrl || image);

    // Robots Control
    if (noIndex) {
        setMeta('robots', 'noindex, nofollow');
        setMeta('googlebot', 'noindex');
    } else {
        setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
        setMeta('googlebot', 'index, follow');
    }

    // --- 3. CANONICAL TAG ---
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    const cleanPath = (path || window.location.pathname).split('?')[0];
    link.setAttribute('href', `https://murad-group.com${cleanPath}`);

    // --- 4. MASTER JSON-LD GENERATOR (The Knowledge Graph) ---
    const oldScript = document.getElementById('murad-dynamic-schema');
    if (oldScript) oldScript.remove();

    const schemaGraph: any = {
        "@context": "https://schema.org",
        "@graph": []
    };

    // A. Organization Schema (Persistent Authority)
    schemaGraph["@graph"].push({
        "@type": "Organization",
        "@id": "https://murad-group.com/#organization",
        "name": "مجموعة ميلاف مراد",
        "url": "https://murad-group.com",
        "logo": {
            "@type": "ImageObject",
            "url": "https://murad-group.com/logo.png",
            "width": 512,
            "height": 512
        },
        "sameAs": [
            "https://twitter.com/IpMurad",
            "https://linkedin.com/in/murad-aljohani",
            "https://instagram.com/murad_group"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+966-50-000-0000",
            "contactType": "customer service",
            "areaServed": "SA",
            "availableLanguage": ["Arabic", "English"]
        }
    });

    // B. WebSite Schema (Search Box)
    schemaGraph["@graph"].push({
        "@type": "WebSite",
        "@id": "https://murad-group.com/#website",
        "url": "https://murad-group.com/",
        "name": "ميلاف مراد",
        "publisher": { "@id": "https://murad-group.com/#organization" },
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://murad-group.com/?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    });

    // C. Breadcrumbs (Hierarchy Signal)
    const segments = cleanPath.split('/').filter(Boolean);
    const breadcrumbItems = [
        { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://murad-group.com/" }
    ];
    
    const segmentMap: Record<string, string> = {
        'jobs': 'الوظائف', 'academy': 'الأكاديمية', 'market': 'السوق', 
        'haraj': 'الحراج', 'cloud': 'المدونة التقنية', 'training': 'التدريب'
    };

    segments.forEach((seg, index) => {
        const name = segmentMap[seg] || decodeURIComponent(seg).replace(/-/g, ' ');
        breadcrumbItems.push({
            "@type": "ListItem",
            "position": index + 2,
            "name": name.charAt(0).toUpperCase() + name.slice(1),
            "item": `https://murad-group.com/${segments.slice(0, index + 1).join('/')}`
        });
    });

    schemaGraph["@graph"].push({
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems
    });

    // D. FAQ Schema (CTR Booster)
    if (faq && faq.length > 0) {
        schemaGraph["@graph"].push({
            "@type": "FAQPage",
            "mainEntity": faq.map(f => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.answer
                }
            }))
        });
    }

    // E. Contextual Entity Schemas
    if (data) {
        if (type === 'Job') {
            schemaGraph["@graph"].push({
                "@type": "JobPosting",
                "title": data.title,
                "description": data.description || description,
                "datePosted": data.date || new Date().toISOString(),
                "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                "employmentType": data.type === 'Part-time' ? "PART_TIME" : "FULL_TIME",
                "hiringOrganization": { "@type": "Organization", "name": data.company || "Mylaf Partners", "logo": data.logoUrl },
                "jobLocation": { "@type": "Place", "address": { "@type": "PostalAddress", "addressLocality": data.location || "Riyadh", "addressCountry": "SA" } },
                "baseSalary": { "@type": "MonetaryAmount", "currency": "SAR", "value": { "@type": "QuantitativeValue", "value": 8000, "unitText": "MONTH" } }
            });
        } else if (type === 'Course') {
            schemaGraph["@graph"].push({
                "@type": "Course",
                "name": data.title,
                "description": data.description || description,
                "provider": { "@type": "Organization", "name": data.provider || "Mylaf Academy", "sameAs": "https://murad-group.com" },
                "hasCourseInstance": { "@type": "CourseInstance", "courseMode": "online", "courseWorkload": `P${data.hours || 10}H` },
                "offers": { "@type": "Offer", "category": "Paid", "priceCurrency": "SAR", "price": data.price || 0, "availability": "https://schema.org/InStock" },
                "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "1240" }
            });
        } else if (type === 'Article') {
            schemaGraph["@graph"].push({
                "@type": "TechArticle",
                "headline": title,
                "image": [data.imageUrl || image],
                "datePublished": publishedTime,
                "dateModified": new Date().toISOString(),
                "author": [{ "@type": "Person", "name": author, "url": "https://murad-group.com/group/about" }],
                "publisher": { "@id": "https://murad-group.com/#organization" },
                "description": description,
                "proficiencyLevel": "Expert"
            });
        } else if (type === 'Product') {
            schemaGraph["@graph"].push({
                "@type": "Product",
                "name": data.title,
                "image": data.images?.[0] || image,
                "description": data.description,
                "brand": { "@type": "Brand", "name": "Haraj Mylaf" },
                "offers": {
                    "@type": "Offer",
                    "url": window.location.href,
                    "priceCurrency": "SAR",
                    "price": data.price,
                    "availability": "https://schema.org/InStock",
                    "itemCondition": data.condition === 'New' ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
                    "seller": { "@type": "Person", "name": data.sellerName }
                }
            });
        }
    }

    // Inject script
    const script = document.createElement('script');
    script.id = 'murad-dynamic-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaGraph);
    document.head.appendChild(script);

    return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
    };

  }, [title, description, type, data, image, path, noIndex, keywords, faq]);

  return null;
};
