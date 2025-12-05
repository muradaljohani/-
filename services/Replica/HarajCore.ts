
export const HARAJ_CITIES = [
    { id: 'all', name: 'كل المدن' },
    { id: 'riyadh', name: 'الرياض' },
    { id: 'jeddah', name: 'جدة' },
    { id: 'makkah', name: 'مكة' },
    { id: 'madinah', name: 'المدينة' },
    { id: 'dammam', name: 'الدمام' },
    { id: 'khobar', name: 'الخبر' },
    { id: 'hafar', name: 'حفر الباطن' },
    { id: 'tabuk', name: 'تبوك' },
    { id: 'hail', name: 'حائل' },
    { id: 'qassim', name: 'القصيم' },
    { id: 'abhah', name: 'أبها' },
    { id: 'taif', name: 'الطائف' },
];

export const HARAJ_TAG_TREE: any = {
    'Cars': {
        label: 'سيارات',
        children: {
            'Toyota': { label: 'تويوتا', children: ['كامري', 'لاندكروزر', 'هايلكس', 'يارس', 'كورولا', 'اف جي'] },
            'Hyundai': { label: 'هيونداي', children: ['إلنترا', 'سوناتا', 'أكسنت', 'توسان', 'ازيرا'] },
            'Ford': { label: 'فورد', children: ['فكتوريا', 'ماركيز', 'توروس', 'إكسبلورر', 'موستنج'] },
            'Nissan': { label: 'نيسان', children: ['باترول', 'مكسيما', 'التيما', 'ددسن'] },
            'GMC': { label: 'جمس', children: ['يوكن', 'سييرا', 'سويم'] },
        }
    },
    'RealEstate': { 
        label: 'عقار', 
        children: {
            'Rent': { label: 'إيجار', children: ['شقة', 'فيلا', 'دور', 'محل'] },
            'Sale': { label: 'بيع', children: ['أرض', 'فيلا', 'شقة', 'عمارة'] }
        }
    },
    'Devices': { 
        label: 'أجهزة', 
        children: {
            'Apple': { label: 'أبل', children: ['ايفون', 'ايباد', 'ماك'] },
            'Samsung': { label: 'سامسونج', children: ['جالكسي', 'نوت'] }
        } 
    },
    'Animals': { 
        label: 'مواشي', 
        children: {
            'Sheep': { label: 'غنم', children: ['نعيم', 'حري', 'نجدي'] },
            'Camel': { label: 'إبل', children: ['مغاتير', 'مجاهيم'] }
        } 
    },
    'Furniture': { label: 'أثاث', children: {} },
    'Services': { label: 'خدمات', children: {} },
};

export const HARAJ_OATH = "أقسم بالله العظيم أن أذكر الحقيقة في إعلاني، وأن لا أبيع سلعة مسروقة أو ممنوعة، وأن أدفع العمولة المستحقة للموقع (1%) في حال البيع، والله على ما أقول شهيد.";
