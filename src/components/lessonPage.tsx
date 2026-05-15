import "../App.css"

export default function LessonPage() {
  

  return (
    <><div className="page active" id="page-home">
      <div className="layout">

       
        <aside className="sidebar">
          <div className="sidebar-brand">
            <span className="brand-dot"></span>
            <span className="brand-name">LearnCSS</span>
          </div>

          <p className="sidebar-subtitle">Interactive Web Course</p>

          <div className="progress-overview">
            <div className="progress-label">
              <span>Course Progress</span>
              <span className="progress-pct" id="overall-pct">0%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" id="overall-bar" style={{width: "0%"}}></div>
            </div>
          </div>

          <nav className="lesson-nav" id="lesson-nav">
           
          </nav>
        </aside>

        
        <main className="main-content">
          <header className="hero">
            <div className="hero-tag">Start Learning</div>
            <h1 className="hero-title">Master CSS<br /><em>from scratch.</em></h1>
            <p className="hero-desc">
              A structured, hands-on course covering everything from formatting
              to complex animations. Pick a lesson from the sidebar to begin.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num" id="stat-lessons">4</span>
                <span className="stat-label">Lessons</span>
              </div>
              <div className="stat">
                <span className="stat-num" id="stat-topics">0</span>
                <span className="stat-label">Topics</span>
              </div>
              <div className="stat">
                <span className="stat-num" id="stat-done">0</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          </header>

          <div className="lesson-cards" id="lesson-cards">
           
          </div>
        </main>
      </div>
    </div>
  <div className="page" id="page-topic">
    <div className="layout">
 
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-dot"></span>
          <span className="brand-name">LearnCSS</span>
        </div>
        <p className="sidebar-subtitle">Interactive Web Course</p>
 
        <div className="progress-overview">
          <div className="progress-label">
            <span>Course Progress</span>
            <span className="progress-pct" id="topic-overall-pct">0%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" id="topic-overall-bar" style={{width: "0%"}}></div>
          </div>
        </div>
 
        <nav className="lesson-nav" id="lesson-nav-topic">
          
        </nav>
      </aside>
 
      <main className="main-content topic-main" id="topic-content">
       
      </main>
    </div>
  </div></>
  );
}
