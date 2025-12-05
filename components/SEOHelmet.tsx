
import React, { useEffect } from 'react';
import { Enterprise } from '../services/Enterprise/EnterpriseCore';

interface SEOHelmetProps {
  title: string;
  description?: string;
  type?: 'Job' | 'Course' | 'Product' | 'General';
  data?: any; // The raw data object (Job, Product, Course)
  image?: string;
  path?: string;
}

/**
 * THE SEO HELMET (Smart Meta-Tag Generator)
 * Automatically handles:
 * 1. Dynamic Titles & Descriptions
 * 2. Open Graph (Social Cards)
 * 3. Canonical Shield
 * 4. Schema Injection
 */
export const SEOHelmet: React.FC<SEOHelmetProps> = ({ 
    title, 
    description = "منصة ميلاف مراد الوطنية للتوظيف والتدريب، بوابتك للوظائف الحكومية والشركات والدورات المعتمدة وتقنيات الذكاء الاصطناعي.", 
    type = 'General', 
    data,
    image = "https://murad-group.com/og-default.jpg",
    path
}) => {
  
  useEffect(() => {
    // --- 1. DYNAMIC TITLE GENERATION ---
    // Logic: [Item Name] | [Category/Location] | [Brand]
    let finalTitle = `${title} | ميلاف مراد`;
    if (type === 'Job' && data) {
        finalTitle = `${data.title} في ${data.location} | وظائف ميلاف`;
    } else if (type === 'Product' && data) {
        finalTitle = `${data.title} للبيع في ${data.location} | حراج ميلاف`;
    } else if (type === 'Course' && data) {
        finalTitle = `دورة ${data.title} (${data.hours} ساعة) | أكاديمية ميلاف`;
    }
    
    document.title = finalTitle;

    // --- 2. SMART DESCRIPTION GENERATOR ---
    // Logic: Strip HTML, Truncate to 160 chars, Add CTA.
    let finalDesc = description;
    if (data && data.description) {
        const cleanDesc = data.description.replace(/<[^>]*>?/gm, '');
        finalDesc = cleanDesc.substring(0, 155) + "...";
    }

    // Helper to set meta tags
    const setMeta = (name: string, content: string, isProp: boolean = false) => {
        let element = document.querySelector(isProp ? `meta[property="${name}"]` : `meta[name="${name}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(isProp ? 'property' : 'name', name);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    // --- 3. INJECT META TAGS ---
    setMeta('description', finalDesc);
    
    // Open Graph (Facebook/WhatsApp)
    setMeta('og:title', finalTitle, true);
    setMeta('og:description', finalDesc, true);
    setMeta('og:type', type === 'General' ? 'website' : 'article', true);
    setMeta('og:image', data?.images?.[0] || data?.thumbnail || image, true);
    setMeta('og:url', `https://murad-group.com${path || window.location.pathname}`, true);
    setMeta('og:site_name', 'Mylaf Murad Academy', true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDesc);
    setMeta('twitter:image', data?.images?.[0] || data?.thumbnail || image);

    // --- 4. THE TECHNICAL SHIELD (Canonical) ---
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', `https://murad-group.com${path || window.location.pathname}`);

    // --- 5. SCHEMA INJECTION (JSON-LD) ---
    // Delegates to the Polyglot Engine in EnterpriseCore
    if (data) {
        Enterprise.SchemaGen.inject(type as 'Job' | 'Course' | 'Product' | 'General', data);
    } else {
        Enterprise.SchemaGen.inject('General', { title: 'Mylaf Home' });
    }

    // Cleanup (Optional, but good for SPA)
    return () => {
        // We generally leave tags for next page to overwrite, 
        // but removing the schema script prevents duplicate graphs.
        const schemaScript = document.getElementById('murad-schema-gen');
        if (schemaScript) schemaScript.remove();
    };
  }, [title, description, type, data, image, path]);

  return null;
};
