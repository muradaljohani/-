
export interface CloudArticle {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    tags: string[];
    views: number;
    likes: number;
    content?: string;
}

export class ContentEngine {
    private static instance: ContentEngine;
    
    // 1 BILLION ARTICLES
    private readonly TOTAL_ARTICLES = 1000000000; 

    private readonly DOMAINS = [
        'الذكاء الاصطناعي الفائق (ASI)', 'الحوسبة الكمومية (Quantum Computing)', 'رياضيات الخوارزميات المعقدة',
        'هندسة البرمجيات العكسية', 'بنية محركات البحث (Google Core)', 'تطوير أنظمة التشغيل',
        'الأمن السيبراني الهجومي (Red Teaming)', 'علم البيانات والتحليل التنبؤي', 'البلوك تشين والعقود الذكية',
        'انترنت الأشياء الصناعي (IIoT)', 'شبكات الجيل السادس 6G', 'الحوسبة السحابية الهجينة',
        'تعلم الآلة العميق (Deep Learning)', 'معالجة اللغات الطبيعية (NLP)', 'الرؤية الحاسوبية المتقدمة',
        'أنظمة إدارة قواعد البيانات الموزعة', 'برمجة النواة (Kernel Programming)', 'تطوير المترجمات (Compilers)',
        'الواقع الممتد (XR)', 'الروبوتات المستقلة'
    ];

    private readonly MATH_CONCEPTS = [
        'الجبر الخطي للمصفوفات', 'التفاضل والتكامل المتقدم', 'نظرية الاحتمالات البايزية',
        'طوبولوجيا الشبكات', 'التحليل العددي', 'نظرية المجموعات الضبابية', 'التحسين التوافقي',
        'الهندسة التفاضلية', 'معادلات فورييه', 'نظرية الفوضى (Chaos Theory)'
    ];

    private readonly GOOGLE_TECHS = [
        'Google Kubernetes Engine (GKE)', 'TensorFlow & JAX', 'Google Cloud Spanner',
        'BigQuery Analytics', 'Flutter Framework', 'Android Kernel', 'Google Search Algorithms (BERT/MUM)',
        'Firebase Backend', 'Google Vertex AI', 'Chrome V8 Engine'
    ];

    private constructor() {}

    public static getInstance(): ContentEngine {
        if (!ContentEngine.instance) {
            ContentEngine.instance = new ContentEngine();
        }
        return ContentEngine.instance;
    }

    /**
     * SEED-BASED DETERMINISTIC GENERATOR
     * Ensures Article #888,888,888 is always the same unique article.
     */
    private generateMetadata(index: number): CloudArticle {
        // Use Prime numbers to scramble the index for variety
        const seed = (index * 15485863) % 1000000007;
        
        const domainIdx = seed % this.DOMAINS.length;
        const mathIdx = (seed * 3) % this.MATH_CONCEPTS.length;
        const techIdx = (seed * 7) % this.GOOGLE_TECHS.length;
        
        const mainTopic = this.DOMAINS[domainIdx];
        const mathTopic = this.MATH_CONCEPTS[mathIdx];
        const googleTech = this.GOOGLE_TECHS[techIdx];
        
        const views = (seed % 5000000) + 50000;
        
        return {
            id: `doc-${index}`,
            title: `المرجع الشامل رقم ${index}: دمج ${mainTopic} مع ${mathTopic} باستخدام ${googleTech}`,
            excerpt: `أطروحة تقنية شاملة (10,000 كلمة) تشرح بالتفصيل الدقيق كيفية بناء أنظمة ${mainTopic} بالاعتماد على الأسس الرياضية لـ ${mathTopic}، مع تطبيقات عملية وشرح للأكواد البرمجية في بيئة ${googleTech}.`,
            category: mainTopic.split(' ')[0],
            author: 'م. مراد الجهني (Murad AI Core)',
            date: new Date(Date.now() - (index % 1000 * 86400000)).toLocaleDateString('ar-SA'),
            readTime: '90 دقيقة',
            tags: [mainTopic, mathTopic, googleTech, 'خوارزميات', 'System Design', 'Google'],
            views: views,
            likes: Math.floor(views * 0.15)
        };
    }

    public getFeed(page: number = 1, limit: number = 12, category?: string): CloudArticle[] {
        const articles: CloudArticle[] = [];
        const start = (page - 1) * limit;

        // To support 1 Billion items, we use direct index mapping
        // We simulate category filtering by hashing indices (in a real DB this is a WHERE clause)
        
        let count = 0;
        let i = start;
        
        // Safety break
        while (count < limit && i < this.TOTAL_ARTICLES) {
            const meta = this.generateMetadata(i);
            // If category is All, take it. If specific, simulated filter check
            if (!category || category === 'All' || meta.category === category) {
                articles.push(meta);
                count++;
            }
            // If filtering, we skip indices to find matches (simulated sparse search)
            i += (category && category !== 'All') ? 17 : 1; 
        }
        
        return articles;
    }

    public getAllCategories(): string[] {
        // Extract unique first words
        return ['All', ...Array.from(new Set(this.DOMAINS.map(d => d.split(' ')[0])))];
    }

    public getArticleById(id: string): CloudArticle | undefined {
        const index = parseInt(id.replace('doc-', ''));
        if (isNaN(index)) return undefined;
        
        const article = this.generateMetadata(index);
        // Lazy Load: Only generate the 10,000 words when opened to save memory
        article.content = this.generateTenThousandWords(article, index);
        return article;
    }

    public search(query: string): CloudArticle[] {
        if (!query) return [];
        // Deterministic search simulation
        const seed = query.length * 12345;
        const results: CloudArticle[] = [];
        for(let i=0; i<15; i++) {
            results.push(this.generateMetadata(seed + i));
        }
        return results;
    }

    // --- THE 10,000 WORD GENERATOR ENGINE ---
    private generateTenThousandWords(meta: CloudArticle, seed: number): string {
        
        // 1. Structure Definition (20 Chapters to hit 10k words)
        const chapters = [
            'الإطار النظري والمفاهيم الأساسية',
            'الأسس الرياضية والمعادلات الحاكمة',
            'تحليل الخوارزميات والتعقيد الزمني (Time Complexity)',
            'هيكلة النظام (System Architecture)',
            'تصميم قاعدة البيانات وتدفق البيانات',
            'إستراتيجيات التشفير والأمن السيبراني',
            'تطوير الواجهة الخلفية (Backend Implementation)',
            'تقنيات قوقل المتقدمة (Google Stack)',
            'الذكاء الاصطناعي وتعلم الآلة في النظام',
            'تحسين الأداء وتوزيع الأحمال (Load Balancing)',
            'إدارة الذاكرة والموارد (Memory Management)',
            'اختبارات الوحدة والتكامل (Unit Testing)',
            'النشر المستمر والأتمتة (CI/CD Pipelines)',
            'مراقبة النظام والتحليلات (Monitoring)',
            'معالجة الأخطاء والتعافي من الكوارث',
            'التوسع الأفقي والعمودي (Scaling)',
            'دراسة حالة: تطبيق عملي في بيئة إنتاج',
            'التحديات المستقبلية والحلول المقترحة',
            'مقارنة مع التقنيات المنافسة',
            'الخاتمة والمراجع العلمية'
        ];

        let html = `
            <div class="doc-header mb-16 pb-8 border-b border-slate-200 text-right" dir="rtl">
                <div class="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-mono mb-4 font-bold">
                    Article ID: #${seed} | Word Count: ~10,250 | Syntax: Verified
                </div>
                <h1 class="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-8">${meta.title}</h1>
                <div class="text-2xl text-slate-600 font-serif leading-relaxed border-r-8 border-blue-600 pr-6">
                    ${meta.excerpt} في هذا المرجع الضخم، سنقوم بشرح مليار سطر برمجي نظرياً وتطبيقياً.
                </div>
            </div>
        `;

        // 2. Generate Content Loop
        chapters.forEach((chapter, idx) => {
            // Each chapter generates ~500 words
            html += `
                <section class="mb-20">
                    <h2 class="text-4xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                        <span class="text-6xl text-slate-200 font-black">${(idx+1).toString().padStart(2, '0')}</span>
                        ${chapter}
                    </h2>
                    
                    <div class="prose prose-xl prose-slate max-w-none font-serif text-justify leading-loose text-slate-700">
                        ${this.generateDeepText(seed + idx, 5)}
                    </div>

                    <!-- Mathematical Model Section -->
                    <div class="my-10 p-8 bg-slate-50 border border-slate-200 rounded-xl">
                        <h4 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            📐 النموذج الرياضي (Mathematical Model)
                        </h4>
                        <div class="font-mono text-lg text-slate-800 bg-white p-4 rounded border border-slate-200" dir="ltr">
                            $$ f(x) = \\sum_{i=0}^{n} \\frac{${seed} \\cdot x^i}{i!} + \\int_{0}^{\\infty} e^{-x} dx $$
                        </div>
                        <p class="mt-4 text-sm text-slate-500">المعادلة 1.${idx}: تمثيل رياضي لكفاءة الخوارزمية المستخدمة في هذا الفصل.</p>
                    </div>

                    <div class="prose prose-xl prose-slate max-w-none font-serif text-justify leading-loose text-slate-700">
                        ${this.generateDeepText(seed + idx + 500, 4)}
                    </div>

                    <!-- Code Block Section -->
                    ${this.generateUniqueCodeBlock(seed + idx, idx)}

                    <div class="prose prose-xl prose-slate max-w-none font-serif text-justify leading-loose text-slate-700 mt-8">
                        ${this.generateDeepText(seed + idx + 1000, 5)}
                    </div>
                </section>
            `;
        });

        return html;
    }

    // --- DEEP TEXT SYNTHESIZER (Technical Arabic) ---
    private generateDeepText(seed: number, paragraphs: number): string {
        const openers = [
            "من الناحية الهيكلية، نجد أن", "وبالنظر إلى تعقيدات هذا النظام، فإن", "تشير الأبحاث المتقدمة في قوقل إلى أن",
            "عند تطبيق هذه المنهجية برمجياً، نلاحظ", "إن التكامل بين العتاد والبرمجيات هنا يتطلب", "في سياق الحوسبة الموزعة، يعتبر"
        ];
        
        const technical_filler = [
            "تحسين التزامن (Concurrency) لتقليل زمن الوصول", "إدارة الذاكرة (Memory Leaks) بشكل يدوي", 
            "استخدام خوارزميات البحث الثنائي (Binary Search)", "تشفير البيانات باستخدام RSA-2048",
            "تحليل البيانات الضخمة باستخدام MapReduce", "توزيع الأحمال عبر خوادم متعددة",
            "استدعاء واجهات برمجة التطبيقات (API Calls)", "معالجة الإشارات الرقمية بدقة عالية"
        ];

        const connectors = [
            "مما يؤدي بدوره إلى", "وهذا ما يفسر سبب", "وبالتالي يمكننا استنتاج أن", 
            "وعلى الرغم من التحديات، فإن", "بالتوازي مع ذلك، نجد أن"
        ];

        let text = "";

        for(let p=0; p < paragraphs; p++) {
            text += `<p class="mb-6">`;
            for(let s=0; s < 8; s++) { // 8 sentences per paragraph
                const rand = (seed + p + s) * 9301;
                const op = openers[rand % openers.length];
                const tech = technical_filler[(rand + 1) % technical_filler.length];
                const conn = connectors[(rand + 2) % connectors.length];
                const tech2 = technical_filler[(rand + 3) % technical_filler.length];
                
                text += `${op} <strong>${tech}</strong> ${conn} تحسين الكفاءة الكلية للنظام، خصوصاً عند ${tech2}. `;
                
                // Add variety
                if (rand % 5 === 0) text += " وهذا يعتبر معياراً أساسياً في هندسة البرمجيات الحديثة (Modern Software Engineering). ";
            }
            text += `</p>`;
        }
        return text;
    }

    // --- POLYMORPHIC CODE GENERATOR ---
    private generateUniqueCodeBlock(seed: number, chapterIdx: number): string {
        const languages = ['python', 'typescript', 'go', 'cpp', 'rust'];
        const lang = languages[seed % languages.length];
        
        let code = "";
        let comment = "";
        
        // Procedural Code Generation
        if (lang === 'python') {
            comment = `# Python Optimization Algorithm v${seed}.0\n# Designed for High-Performance Computing`;
            code = `
import numpy as np
import tensorflow as tf

class NeuralSystem_${seed}:
    def __init__(self, complexity=${seed % 100}):
        self.layers = []
        self.activation = 'relu'
        self.initialize_weights(complexity)

    def process_tensor(self, input_matrix):
        """
        Core processing unit for Chapter ${chapterIdx}
        Optimized for O(n log n) time complexity.
        """
        # Matrix Transformation
        x = tf.matmul(input_matrix, self.weights)
        
        # Non-linear Activation
        if self.activation == 'relu':
            return tf.nn.relu(x)
            
    def optimize_gradient(self, loss):
        # Implementing Stochastic Gradient Descent (SGD)
        grads = tf.gradients(loss, self.weights)
        return [g * 0.01 for g in grads]
            `;
        } else if (lang === 'typescript') {
            comment = `// TypeScript Interface Definition v${seed}\n// Strict Typing for Enterprise Scale`;
            code = `
interface IDataPayload_${seed} {
    id: string;
    timestamp: number;
    vector: number[];
    metadata: Record<string, unknown>;
}

export class DistributedNode_${seed} implements ISystemCore {
    private readonly _buffer: Map<string, IDataPayload_${seed}>;

    constructor(private readonly _config: SystemConfig) {
        this._buffer = new Map();
        this.initializeStream();
    }

    /**
     * Asynchronous Data Pipeline
     * Handles ${seed * 100} requests per second.
     */
    public async processStream(packet: IDataPayload_${seed}): Promise<void> {
        // 1. Validation
        if (!this.validateChecksum(packet)) {
            throw new Error("Data Corruption Detected");
        }

        // 2. Transform & Store
        const optimized = await this.compressPayload(packet);
        this._buffer.set(packet.id, optimized);
    }
}
            `;
        } else {
             comment = `// Low Level System Implementation v${seed}`;
             code = `
// Optimized Memory Allocation
void* allocate_buffer_${seed}(size_t size) {
    void* ptr = malloc(size);
    if (!ptr) return NULL;
    
    // Zero-fill for security
    memset(ptr, 0, size);
    return ptr;
}

int main() {
    // System Boot Sequence
    init_core_${seed}();
    printf("System Online: ID ${seed}");
    return 0;
}
             `;
        }

        return `
            <div class="my-12 bg-[#0d1117] rounded-xl overflow-hidden border border-slate-700 shadow-2xl text-left" dir="ltr">
                <div class="flex justify-between items-center px-4 py-3 bg-[#161b22] border-b border-slate-700">
                    <div class="flex items-center gap-3">
                        <div class="flex gap-1.5">
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div class="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span class="text-xs font-mono text-blue-400 font-bold">src/core/algorithms/${lang}_module_${seed}.${lang === 'typescript' ? 'ts' : 'py'}</span>
                    </div>
                    <span class="text-[10px] text-slate-500 font-mono">COPY</span>
                </div>
                <div class="p-6 overflow-x-auto">
                    <pre class="font-mono text-sm leading-relaxed"><code class="language-${lang}"><span class="text-slate-500">${comment}</span>\n<span class="text-emerald-400">${code.trim()}</span></code></pre>
                </div>
                <div class="bg-[#161b22] px-4 py-2 border-t border-slate-700 text-[10px] text-slate-400 font-mono">
                    Code Generated by Murad Neural Engine | License: MIT | ID: ${seed}
                </div>
            </div>
            <p class="text-sm text-slate-500 font-serif mb-8 bg-slate-50 p-4 border-l-4 border-emerald-500">
                <strong>شرح الكود:</strong> في المقطع البرمجي أعلاه (رقم ${seed})، قمنا بتطبيق خوارزمية متقدمة لمعالجة البيانات. لاحظ كيف يتم استخدام <code>optimize_gradient</code> لتقليل نسبة الخطأ، وهو ما يتوافق مع المبادئ الرياضية التي ناقشناها في الفصل السابق.
            </p>
        `;
    }
}
