
import React from 'react';
import { Lightbulb, Code, BookOpen, User, Search } from 'lucide-react';

interface StarterPromptsProps {
  onSelect: (prompt: string) => void;
}

export const StarterPrompts: React.FC<StarterPromptsProps> = ({ onSelect }) => {
  const prompts = [
    {
      icon: <User className="w-5 h-5 text-blue-400" />,
      title: "من هو المطور؟",
      subtitle: "تعرف على المهندس مراد",
      prompt: "من هو المهندس مراد عبدالرزاق الجهني؟ وما هي إنجازاته؟"
    },
    {
      icon: <Search className="w-5 h-5 text-emerald-400" />,
      title: "بحث شامل",
      subtitle: "استخدم محرك البحث",
      prompt: "ابحث لي عن أحدث أخبار التقنية والذكاء الاصطناعي اليوم."
    },
    {
      icon: <Code className="w-5 h-5 text-purple-400" />,
      title: "مساعد برمجيات",
      subtitle: "كتابة وتصحيح الكود",
      prompt: "اكتب لي كود React لإنشاء قائمة مهام (To-Do List) مع التخزين المحلي."
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-yellow-400" />,
      title: "أفكار إبداعية",
      subtitle: "توليد أفكار ومحتوى",
      prompt: "اقترح لي 5 أفكار لمشاريع تجارية ناجحة في السعودية."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto mt-8 animate-fade-in-up px-4 md:px-0">
      {prompts.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelect(item.prompt)}
          className="flex flex-col items-start p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 transition-all duration-300 text-right group backdrop-blur-sm shadow-sm hover:shadow-md"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gray-900/50 group-hover:scale-110 transition-transform border border-white/5">
              {item.icon}
            </div>
            <h3 className="font-bold text-gray-100 text-sm">{item.title}</h3>
          </div>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-1 font-medium">
            {item.subtitle}
          </p>
        </button>
      ))}
    </div>
  );
};
