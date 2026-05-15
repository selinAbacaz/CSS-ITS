# CSS-ITS

## General Information and links

The educational instruction/ lecture and the quiz questions for lesson one: CSS formatting are explicitely written by me !! The rest are filled in by chatgpt to show the vision

### Citations and Links to important files:

https://www.cs.williams.edu/~iris/res/bkt-balloon/index.html -> For BKT research/ what my BKT algorithm is based off of

https://docs.google.com/presentation/d/1xYSCEG-X4Pq1Bn2h9kcEGnQOasjRsce99RjY4aD_nsQ/edit?usp=sharing -> View my google slides

https://github.com/selinAbacaz/CSS-ITS/blob/main/vite-project/src/data/course.ts -> Where all of my ‘lesson lectures’ are for each topic

https://github.com/selinAbacaz/CSS-ITS/blob/main/vite-project/src/data/quizzes.ts -> Where all of my quiz questions + feedback is written

https://github.com/selinAbacaz/CSS-ITS/blob/main/vite-project/src/context/MasteryContext.tsx -> Where my BKT algorithm resides




### How lessons work

Lessons are divided into topics and have a multiple-choice quiz at the end of each topic's instruction. Depending on how good you do, youre allowed to mark the lesson as completed or you have to take the lesson again. In general, you have to get 70% or higher to be able to press complete. You also have the option to skip the topics in the lesson if you feel like you already know the information being taught and skip straight to the end-of-lesson mastery quiz. If you pass the mastery quiz, your topics automatically all reach yellow and you're allowed to go to the next lesson. If not, then... you have to retake the exam or go back to the lessons. The mastery quizzes should also show questions from previous lessons as well to reinforce knowledge. 

### How ITS algorithm works

***I decided to base my algorithm on topic rather than knowledge components.*** The reason behind this choice is that knowledge components for CSS are very simple so I decided to teach via topic instead- this allows me to group several knowledge components into one topic with substance. 

#### Red, yellow, green system

Red, yellow, and green system is used to measure mastery using a BKT-inspired algorithm.
The pKnown starts at .1 which is also where red mastery is given-> You gain yellow (almost mastered) at pKnown .25, you gain green (mastery) at pKnown .9

Current numbers:
pKnown starts at .1,
SLIP = 0.08,
GUESS = 0.25,
LEARN = 0.02,

The red, green, and yellow mastery system is a good way to measure mastery while also not just telling the student "you are 20% mastered" which might be discouraging.
This system was also inspired by Quizlet's flashcard mode !

#### topic quizzes

Topic quizzes range from 3-5 questions each and are at the end of each topic lecture. pKnown is updated per question and fun fact: you can watch your pknown go up and down in the console.logs as you traverse the quiz :)
You have to get a 70% or higher to pass the quiz, and then you can mark it as done- this will make the tab on the dropdown turn green to let you know you completed it.



#### mastery quizzes

Mastery quizzes happen at the end of each lesson. You have to pass the mastery quiz (also 70%) to be able to go to the next lesson. 
They are around 2-3x longer than topic quizzes because they encompass questions from all topics inside the lesson.
Students have the option to skip straight to the mastery quizzes- this is on purpose because some students might already know everything in that particular lesson and I dont want to subject them through several smaller quizzes.
Also, questions you get wrong often should show up more often than questions you get right !
