
import React from 'react';
import { AssetProcessor } from '../services/System/AssetProcessor';

export const FoundersMessage: React.FC = () => {
  const assetProcessor = AssetProcessor.getInstance();

  return (
    <footer style={{
        background: '#0d1b3a',
        padding: '40px',
        color: 'white',
        marginTop: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '40px',
        fontFamily: "'Tajawal', sans-serif",
        direction: 'rtl',
        borderTop: '1px solid rgba(255,255,255,0.05)'
    }}>

        {/* President's Message Block */}
        <div style={{flex: 1, minWidth: '300px', textAlign: 'right'}}>
            
            <h2 style={{margin: 0, fontSize: '2rem', letterSpacing: '1px', fontWeight: '900', color: '#fff', marginBottom: '20px'}}>
                رؤية تتجاوز التعليم التقليدي
            </h2>

            <p style={{
                margin: '0 0 20px',
                fontSize: '1rem',
                color: '#c4d9ff',
                maxWidth: '650px',
                lineHeight: 1.8,
                textAlign: 'justify'
            }}>
                "بسم الله الرحمن الرحيم، نؤمن في مجموعة ميلاف مراد أن الاستثمار الحقيقي يكمن في العقول. لذلك، حرصنا على تأسيس هذه المنصة لتكون نظاماً بيئياً متكاملاً لا يكتفي بمنح الشهادات المعتمدة فحسب، بل يمتد لتمكين الفرد من المهارة، وربطه بفرص العمل، وفتح آفاق التجارة أمامه. نحن هنا لنحول الطموحات إلى واقع ملموس، ونضع بين أيديكم أحدث التقنيات وأفضل الخبرات لبناء مستقبل واعد."
            </p>

            {/* Motivational CTA */}
            <p style={{
                margin: '0 0 30px',
                fontSize: '1.1rem',
                color: '#fbbf24', // Amber/Gold
                fontWeight: 'bold',
                fontStyle: 'italic',
                borderRight: '4px solid #fbbf24',
                paddingRight: '15px'
            }}>
                "القرار الذي تتخذه اليوم، هو الشخص الذي ستكون عليه غداً.. لا تؤجل، ابدأ الآن."
            </p>

            <div>
                <p style={{margin: '0', fontSize: '1.4rem', color: '#4da3ff', fontWeight: 'bold'}}>
                    م. مراد الجهني
                </p>
                <p style={{margin: '5px 0 15px', fontSize: '0.9rem', color: '#88aaff', fontWeight: 'normal'}}>
                    المؤسس والرئيس التنفيذي
                </p>
            </div>

            {/* New Bird Signature SVG */}
            <div style={{ marginTop: '10px' }}>
                <img 
                    src={assetProcessor.getOfficialSignature()} 
                    alt="توقيع م. مراد الجهني"
                    style={{
                        width: '280px',
                        height: 'auto',
                        display: 'block',
                        // Filter to make the blue signature appear white
                        filter: 'brightness(0) invert(1)'
                    }}
                />
            </div>
        </div>

        {/* The Official Seal - Force LTR to prevent mirroring on mobile */}
        <div dir="ltr" style={{
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
        }}>
            <div style={{
                background: 'rgba(255,255,255,0.95)', 
                borderRadius: '50%', 
                padding: '2px',
                boxShadow: '0 0 25px rgba(13, 71, 161, 0.4)'
            }}>
                <img 
                    src={assetProcessor.getOfficialSeal()}
                    alt="الختم الرسمي"
                    style={{
                        width: '180px', 
                        height: '180px', 
                        display: 'block', 
                        ...assetProcessor.getStampStyle(-3) // Applies rotation, opacity, and mix-blend-mode
                    }}
                />
            </div>
            
            <div style={{
                color: '#fbbf24', // Amber/Gold
                fontSize: '1.1rem',
                fontWeight: '900',
                fontFamily: "'Cairo', sans-serif",
                letterSpacing: '1px',
                marginTop: '10px',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                borderBottom: '2px solid rgba(251, 191, 36, 0.5)',
                paddingBottom: '4px',
                display: 'inline-block'
            }}>
                الختم الرسمي
            </div>
        </div>

    </footer>
  );
};
