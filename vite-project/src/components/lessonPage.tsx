export default function LessonPage() {
  const lessonSections = [
    {
      id: "1.0",
      title: "Introduction",
      description:
        "Overview of the lesson goals, concepts, and what students will build.",
    },
    {
      id: "1.1",
      title: "Core Concept",
      description:
        "Explain the first main concept with examples and visuals.",
    },
    {
      id: "1.2",
      title: "Practice Activity",
      description:
        "Interactive challenge or exercise section for students.",
    },
    {
      id: "1.3",
      title: "Mini Project",
      description:
        "Apply everything learned in a small guided project.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#2B2B2B] flex">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-[#E7E2D9] p-6 sticky top-0 h-screen hidden lg:flex flex-col">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[#9A7B4F] font-semibold">
            Lesson 1
          </p>
          <h1 className="text-3xl font-bold mt-2 leading-tight">
            Intro to CSS Movement
          </h1>
        </div>

        <nav className="mt-10 flex flex-col gap-3">
          {lessonSections.map((section) => (
            <a
              key={section.id}
              href={`#section-${section.id}`}
              className="bg-[#F5EFE4] hover:bg-[#EDE2D0] transition rounded-2xl px-4 py-3"
            >
              <p className="text-sm font-semibold text-[#9A7B4F]">
                Part {section.id}
              </p>
              <p className="text-base font-medium">{section.title}</p>
            </a>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <button className="w-full rounded-2xl bg-[#2B2B2B] text-white py-3 text-sm font-semibold hover:opacity-90 transition">
            Mark Lesson Complete
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-10 md:px-12 lg:px-20 overflow-y-auto">
        {/* Hero Section */}
        <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#ECE7DF]">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[#9A7B4F] font-semibold">
              Lesson 1
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
              Learning CSS Movement & Animation
            </h2>

            <p className="mt-6 text-lg text-[#5A5A5A] leading-relaxed">
              This lesson introduces movement in CSS using transitions,
              transforms, and animations. Each section builds toward creating
              interactive UI effects.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <div className="bg-[#F5EFE4] rounded-2xl px-5 py-3">
                <p className="text-xs uppercase text-[#9A7B4F] font-semibold">
                  Duration
                </p>
                <p className="font-medium">45 Minutes</p>
              </div>

              <div className="bg-[#F5EFE4] rounded-2xl px-5 py-3">
                <p className="text-xs uppercase text-[#9A7B4F] font-semibold">
                  Difficulty
                </p>
                <p className="font-medium">Beginner</p>
              </div>
            </div>
          </div>
        </section>

        {/* Lesson Sections */}
        <div className="mt-10 flex flex-col gap-10">
          {lessonSections.map((section) => (
            <section
              key={section.id}
              id={`section-${section.id}`}
              className="bg-white rounded-[2rem] border border-[#ECE7DF] p-8 md:p-10 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="max-w-2xl">
                  <p className="text-sm uppercase tracking-[0.25em] text-[#9A7B4F] font-semibold">
                    Part {section.id}
                  </p>

                  <h3 className="text-3xl font-bold mt-3">
                    {section.title}
                  </h3>

                  <p className="mt-5 text-[#5A5A5A] leading-relaxed text-lg">
                    {section.description}
                  </p>
                </div>

                {/* Optional Media / Notes Box */}
                <div className="w-full md:w-72 bg-[#F8F7F4] rounded-2xl p-5 border border-[#ECE7DF]">
                  <p className="text-sm font-semibold text-[#9A7B4F] uppercase tracking-wide">
                    Notes
                  </p>

                  <ul className="mt-4 flex flex-col gap-3 text-sm text-[#5A5A5A] list-disc list-inside">
                    <li>Add diagrams or screenshots here</li>
                    <li>Include tips or reminders</li>
                    <li>Attach code snippets or examples</li>
                  </ul>
                </div>
              </div>

              {/* Content Area */}
              <div className="mt-8 bg-[#F8F7F4] rounded-2xl border border-dashed border-[#D9D1C5] p-8 min-h-[220px] flex items-center justify-center text-center text-[#7A7A7A]">
                Replace this area with lesson content, embedded videos,
                exercises, code blocks, quizzes, or illustrations.
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
