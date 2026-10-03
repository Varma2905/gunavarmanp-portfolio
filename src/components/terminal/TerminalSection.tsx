import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCommand, FiCpu, FiPlay, FiZap, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { EDUCATION, EXPERIENCES, PERSONAL_INFO, PROJECTS, SKILLS } from '@/lib/constants';

type Tone = 'command' | 'output' | 'success' | 'error' | 'boot' | 'info';

type TerminalLine = {
  id: string;
  text: string;
  tone: Tone;
};

type GameName = 'snake' | 'tictactoe' | 'guess' | 'memory' | 'typing' | 'hangman' | 'quiz';

type ActiveGame = {
  name: GameName;
  status: 'ready' | 'playing' | 'won' | 'lost';
  board?: string[];
  snake?: { x: number; y: number }[];
  food?: { x: number; y: number };
  direction?: string;
  score?: number;
  target?: number;
  prompt?: string;
  answer?: string;
  misses?: number;
  letters?: string[];
  word?: string;
  question?: string;
  choices?: string[];
  expected?: string;
  sequence?: string;
};

const bootSequence = [
  'Initializing Spider Core...',
  'Syncing neural web...',
  'Calibrating spider-sense...',
  'Starting Spider OS...',
  'System Ready.'
];

const commandList = [
  'help', 'about', 'skills', 'projects', 'experience', 'education',
  'resume', 'contact', 'github', 'linkedin', 'whoami', 'games', 'clear'
];

const gameNames: { key: GameName; label: string }[] = [
  { key: 'snake', label: 'Snake' },
  { key: 'tictactoe', label: 'Tic Tac Toe' },
  { key: 'guess', label: 'Number Guess' },
  { key: 'memory', label: 'Memory Match' },
  { key: 'typing', label: 'Typing Speed Test' },
  { key: 'hangman', label: 'Hangman' },
  { key: 'quiz', label: 'AI Quiz' }
];

const quizBank = [
  { question: 'What does RAG stand for?', answer: 'retrieval augmented generation' },
  { question: 'Which build tool powers this portfolio UI?', answer: 'vite' },
  { question: 'What is the core language for this terminal?', answer: 'typescript' }
];

const wordBank = ['neural', 'quantum', 'signal', 'vector', 'cosmos', 'orbit', 'rocket', 'cipher'];

function createLine(text: string, tone: Tone): TerminalLine {
  return { id: `${Date.now()}-${Math.random()}`, text, tone };
}

function formatBoard(board: string[]) {
  return [
    `+---+---+---+`,
    `| ${board[0] ?? ' '} | ${board[1] ?? ' '} | ${board[2] ?? ' '} |`,
    `+---+---+---+`,
    `| ${board[3] ?? ' '} | ${board[4] ?? ' '} | ${board[5] ?? ' '} |`,
    `+---+---+---+`,
    `| ${board[6] ?? ' '} | ${board[7] ?? ' '} | ${board[8] ?? ' '} |`,
    `+---+---+---+`
  ].join('\n');
}

function createSnakeBoard(snake: { x: number; y: number }[], food: { x: number; y: number }) {
  const rows: string[] = [];
  for (let y = 0; y < 5; y += 1) {
    let row = '';
    for (let x = 0; x < 5; x += 1) {
      const isHead = snake[0]?.x === x && snake[0]?.y === y;
      const isBody = snake.some((segment) => segment.x === x && segment.y === y);
      const isFood = food.x === x && food.y === y;
      row += isHead ? 'H' : isBody ? 'S' : isFood ? 'F' : '.';
    }
    rows.push(row);
  }
  return rows.join('\n');
}

export function TerminalSection() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [bootStep, setBootStep] = useState(0);
  const [booted, setBooted] = useState(false);
  const [theme, setTheme] = useState<'neon' | 'matrix'>('neon');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeGame, setActiveGame] = useState<ActiveGame | null>(null);
  const [chatMode, setChatMode] = useState(false);
  const [highScore, setHighScore] = useState(0);
  /* The terminal must never pull the page to itself. It stays dormant until
     the section is actually scrolled into view, and it only takes keyboard
     focus once the visitor deliberately clicks inside it. */
  const [inView, setInView] = useState(false);
  const [userEngaged, setUserEngaged] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const typingTimersRef = useRef<number[]>([]);

  /* Pins the internal scroll region to its latest line, including while
     typeLine() streams characters in — mirrors a real terminal's autoscroll
     now that the console is a fixed-height box instead of growing in place. */
  useEffect(() => {
    const node = outputRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [lines, bootStep]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem('varma-terminal-highscore');
    if (stored) {
      setHighScore(Number(stored));
    }
  }, []);

  useEffect(() => {
    if (highScore > 0) {
      window.localStorage.setItem('varma-terminal-highscore', String(highScore));
    }
  }, [highScore]);

  useEffect(() => {
    if (!inView) {
      return;
    }

    if (bootStep < bootSequence.length) {
      const timer = window.setTimeout(() => {
        setLines((prev) => [...prev, createLine(bootSequence[bootStep], 'boot')]);
        setBootStep((value) => value + 1);
      }, 650);
      return () => window.clearTimeout(timer);
    }

    const readyTimer = window.setTimeout(() => {
      setBooted(true);
      setLines((prev) => [
        ...prev,
        createLine('Spider OS online. Type "help" to access the command deck.', 'success')
      ]);
    }, 400);

    return () => window.clearTimeout(readyTimer);
  }, [bootStep, inView]);

  useEffect(() => {
    /* Focus is only ever taken after the visitor clicks into the console,
       so the page is never yanked down to the terminal on load. */
    if (booted && userEngaged) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [booted, userEngaged, activeGame, chatMode]);

  /* The console body is fixed-height, so it scrolls internally as content
     grows instead of resizing the box or relying on page scroll. */

  const clearTypingTimers = () => {
    typingTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    typingTimersRef.current = [];
  };

  const addLine = (text: string, tone: Tone = 'output') => {
    setLines((prev) => [...prev, createLine(text, tone)]);
  };

  const typeLine = (text: string, tone: Tone = 'output', speed = 16) => {
    const id = `${Date.now()}-${Math.random()}`;
    setLines((prev) => [...prev, { id, text: '', tone }]);

    if (!text) {
      setLines((prev) => prev.map((line) => (line.id === id ? { ...line, text: '' } : line)));
      return;
    }

    let index = 0;
    const renderNextChar = () => {
      setLines((prev) => prev.map((line) => (line.id === id ? { ...line, text: text.slice(0, index + 1) } : line)));
      index += 1;

      if (index < text.length) {
        const timeoutId = window.setTimeout(renderNextChar, speed);
        typingTimersRef.current.push(timeoutId);
      } else {
        setLines((prev) => prev.map((line) => (line.id === id ? { ...line, text } : line)));
      }
    };

    const timeoutId = window.setTimeout(renderNextChar, speed);
    typingTimersRef.current.push(timeoutId);
  };

  const startGame = (name: GameName) => {
    if (name === 'guess') {
      const target = Math.floor(Math.random() * 100) + 1;
      setActiveGame({ name, status: 'playing', target });
      typeLine('Number Guess engaged. Enter a number between 1 and 100.', 'info');
      return;
    }

    if (name === 'tictactoe') {
      setActiveGame({ name, status: 'playing', board: Array(9).fill(' ') });
      typeLine('Tic Tac Toe ready. Type a number 1-9 to place X.\n' + formatBoard(Array(9).fill(' ')), 'info');
      return;
    }

    if (name === 'snake') {
      const startSnake = [{ x: 1, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 0 }];
      const food = { x: 4, y: 2 };
      setActiveGame({ name, status: 'playing', snake: startSnake, food, direction: 'right', score: 0 });
      typeLine('Snake loaded. Use w/a/s/d or the words up/left/down/right to move.\n' + createSnakeBoard(startSnake, food), 'info');
      return;
    }

    if (name === 'memory') {
      const sequence = `${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9) + 1}`;
      setActiveGame({ name, status: 'playing', sequence });
      typeLine(`Memory Match ready. Memorize this sequence: ${sequence}\nType it back when prompted.`, 'info');
      return;
    }

    if (name === 'typing') {
      const targetWord = wordBank[Math.floor(Math.random() * wordBank.length)];
      setActiveGame({ name, status: 'playing', prompt: targetWord, answer: targetWord });
      typeLine(`Typing Speed Test ready. Type this word exactly: ${targetWord}`, 'info');
      return;
    }

    if (name === 'hangman') {
      const word = wordBank[Math.floor(Math.random() * wordBank.length)];
      const letters = Array(word.length).fill('_');
      setActiveGame({ name, status: 'playing', word, letters, misses: 0 });
      typeLine(`Hangman ready. Word: ${letters.join(' ')}\nGuess a letter.`, 'info');
      return;
    }

    if (name === 'quiz') {
      const picked = quizBank[Math.floor(Math.random() * quizBank.length)];
      setActiveGame({ name, status: 'playing', question: picked.question, expected: picked.answer });
      typeLine(`AI Quiz: ${picked.question}\nType your answer.`, 'info');
    }
  };

  const handleGameInput = (command: string) => {
    if (!activeGame) {
      return;
    }

    const { name } = activeGame;
    if (command === 'quit') {
      setActiveGame(null);
      typeLine('Game exited. Return to the command deck.', 'success');
      return;
    }

    if (name === 'guess') {
      const guess = Number(command);
      if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
        typeLine('Enter a valid integer between 1 and 100.', 'error');
        return;
      }

      const target = activeGame.target ?? 0;
      if (guess === target) {
        setHighScore((prev) => prev + 10);
        setActiveGame(null);
        typeLine(`Correct! ${target} was the number.`, 'success');
      } else if (guess < target) {
        typeLine('Too low. Try again.', 'info');
      } else {
        typeLine('Too high. Try again.', 'info');
      }
      return;
    }

    if (name === 'tictactoe') {
      const cell = Number(command);
      if (!Number.isInteger(cell) || cell < 1 || cell > 9) {
        typeLine('Pick a square from 1 to 9.', 'error');
        return;
      }
      const board = [...(activeGame.board ?? Array(9).fill(' '))];
      const index = cell - 1;
      if (board[index] !== ' ') {
        typeLine('That square is already taken.', 'error');
        return;
      }
      board[index] = 'X';
      if (checkWinner(board, 'X')) {
        setHighScore((prev) => prev + 5);
        setActiveGame(null);
        typeLine('You win!\n' + formatBoard(board), 'success');
        return;
      }
      const aiIndex = findBestMove(board);
      board[aiIndex] = 'O';
      if (checkWinner(board, 'O')) {
        setActiveGame(null);
        typeLine('AI wins.\n' + formatBoard(board), 'error');
        return;
      }
      setActiveGame({ ...activeGame, board, status: 'playing' });
      typeLine('Your turn.\n' + formatBoard(board), 'info');
      return;
    }

    if (name === 'snake') {
      const direction = parseDirection(command);
      if (!direction) {
        typeLine('Use w/a/s/d or up/left/down/right.', 'error');
        return;
      }
      const snake = [...(activeGame.snake ?? [])];
      const food = activeGame.food ?? { x: 0, y: 0 };
      const nextHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
      const hitWall = nextHead.x < 0 || nextHead.x > 4 || nextHead.y < 0 || nextHead.y > 4;
      if (hitWall) {
        setActiveGame(null);
        typeLine('Snake hit the wall. Game over.', 'error');
        return;
      }
      snake.unshift(nextHead);
      const ateFood = nextHead.x === food.x && nextHead.y === food.y;
      if (!ateFood) {
        snake.pop();
      } else {
        setHighScore((prev) => prev + 1);
      }
      const board = createSnakeBoard(snake, food);
      if (snake.slice(1).some((segment) => segment.x === nextHead.x && segment.y === nextHead.y)) {
        setActiveGame(null);
        typeLine('Snake collided with itself. Game over.\n' + board, 'error');
        return;
      }
      setActiveGame({ ...activeGame, snake, food: ateFood ? { x: Math.floor(Math.random() * 5), y: Math.floor(Math.random() * 5) } : food, direction: command, score: (activeGame.score ?? 0) + (ateFood ? 1 : 0) });
      typeLine(board, 'info');
      return;
    }

    if (name === 'memory') {
      if (command === activeGame.sequence) {
        setHighScore((prev) => prev + 3);
        setActiveGame(null);
        typeLine('Perfect memory. Sequence matched.', 'success');
      } else {
        setActiveGame(null);
        typeLine(`Nope. The correct sequence was ${activeGame.sequence}.`, 'error');
      }
      return;
    }

    if (name === 'typing') {
      if (command === activeGame.answer) {
        setHighScore((prev) => prev + 2);
        setActiveGame(null);
        typeLine('Fast fingers. Perfect match.', 'success');
      } else {
        setActiveGame(null);
        typeLine(`Not quite. The target was ${activeGame.answer}.`, 'error');
      }
      return;
    }

    if (name === 'hangman') {
      const letter = command.toLowerCase();
      const word = activeGame.word ?? '';
      const letters = [...(activeGame.letters ?? [])];
      if (word.includes(letter)) {
        for (let index = 0; index < word.length; index += 1) {
          if (word[index] === letter) {
            letters[index] = letter;
          }
        }
        if (!letters.includes('_')) {
          setHighScore((prev) => prev + 4);
          setActiveGame(null);
          typeLine(`Solved! The word was ${word}.`, 'success');
          return;
        }
        setActiveGame({ ...activeGame, letters, status: 'playing' });
        typeLine(`Correct! ${letters.join(' ')}`, 'info');
      } else {
        const misses = (activeGame.misses ?? 0) + 1;
        if (misses >= 6) {
          setActiveGame(null);
          typeLine(`Game over. The word was ${word}.`, 'error');
          return;
        }
        setActiveGame({ ...activeGame, misses, status: 'playing' });
        typeLine(`Miss! ${6 - misses} tries left.`, 'error');
      }
      return;
    }

    if (name === 'quiz') {
      const inputAns = command.trim().toLowerCase();
      const expectedAns = (activeGame.expected || '').toLowerCase();
      const isCorrect = inputAns === expectedAns ||
        (expectedAns === 'vite' && (inputAns === 'react' || inputAns === 'vite.js' || inputAns === 'vite + react')) ||
        (expectedAns.includes('retrieval') && inputAns.includes('retrieval'));

      if (isCorrect) {
        setHighScore((prev) => prev + 3);
        setActiveGame(null);
        typeLine('Correct. Neural knowledge confirmed.', 'success');
      } else {
        setActiveGame(null);
        typeLine(`Wrong. The answer was ${activeGame.expected}.`, 'error');
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    const command = input.trim();
    setHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);
    setInput('');

    const lower = command.toLowerCase();

    if (chatMode && lower !== 'exit') {
      addLine(`you: ${command}`, 'command');
      const response = replyToChat(command);
      typeLine(response, 'success');
      return;
    }

    addLine(`spider@web:~$ ${command}`, 'command');

    if (activeGame) {
      handleGameInput(lower);
      return;
    }

    switch (lower) {
      case 'help':
        typeLine('Available commands:\n' + commandList.join(', '), 'info');
        break;
      case 'about':
        typeLine(`${PERSONAL_INFO.name}\n${PERSONAL_INFO.title}\n${PERSONAL_INFO.bio}`, 'info');
        break;
      case 'skills':
        typeLine(SKILLS.slice(0, 8).map((skill) => `${skill.name} - ${skill.level}%`).join('\n'), 'info');
        break;
      case 'projects':
        typeLine(PROJECTS.map((project) => `${project.title}: ${project.category}`).join('\n'), 'info');
        break;
      case 'experience':
        typeLine(EXPERIENCES.map((item) => `${item.role} @ ${item.company}`).join('\n'), 'info');
        break;
      case 'education':
        typeLine(EDUCATION.map((item) => `${item.degree}`).join('\n'), 'info');
        break;
      case 'resume':
        typeLine('Resume ready for review. Visit the portfolio site for download options.', 'info');
        break;
      case 'contact':
        typeLine(`${PERSONAL_INFO.email}\n${PERSONAL_INFO.phone}\n${PERSONAL_INFO.location}`, 'info');
        break;
      case 'github':
        typeLine(PERSONAL_INFO.github, 'success');
        break;
      case 'linkedin':
        typeLine(PERSONAL_INFO.linkedin, 'success');
        break;
      case 'clear':
        setLines([]);
        break;
      case 'whoami':
        typeLine(`${PERSONAL_INFO.shortName}\n${PERSONAL_INFO.title}`, 'info');
        break;
      case 'games':
        typeLine('Available Games\n' + gameNames.map((game) => `${game.key} - ${game.label}`).join('\n'), 'info');
        break;
      case 'snake':
        startGame('snake');
        break;
      case 'tictactoe':
      case 'tic tac toe':
      case 'tic-tac-toe':
        startGame('tictactoe');
        break;
      case 'guess':
      case 'number guess':
      case 'number-guess':
        startGame('guess');
        break;
      case 'memory':
      case 'memory match':
      case 'memory-match':
        startGame('memory');
        break;
      case 'typing':
      case 'typing test':
      case 'typing speed test':
        startGame('typing');
        break;
      case 'hangman':
        startGame('hangman');
        break;
      case 'quiz':
      case 'ai quiz':
      case 'ai-quiz':
      case 'aiquiz':
        startGame('quiz');
        break;
      default:
        typeLine('Command not recognized. Try help.', 'error');
    }
  };

  const replyToChat = (message: string) => {
    const lower = message.toLowerCase();
    if (lower.includes('skill')) return 'I build agentic AI systems, full-stack apps, and immersive web experiences with React, Next.js, FastAPI, LangChain, and LangGraph.';
    if (lower.includes('project')) return 'My work includes agentic AI platforms, deep learning systems, and modern finance dashboards.';
    if (lower.includes('contact')) return 'You can reach me at varma2905.tnp@gmail.com or through the contact section.';
    if (lower.includes('hello') || lower.includes('hi')) return 'Hello. I am Varma, AI Engineer and Full Stack Developer.';
    if (lower.includes('resume')) return 'I can share a resume and relevant case studies for your team.';
    return 'I am streaming from the Spider OS. Ask me about products, AI systems, or product strategy.';
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      setLines([]);
      addLine('Terminal cleared.', 'info');
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      clearTypingTimers();
      addLine('^C', 'error');
      addLine('Command cancelled.', 'error');
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(history[history.length - 1 - nextIndex] ?? '');
      }
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const matches = commandList.filter((command) => command.startsWith(input.toLowerCase()));
      if (matches.length > 0) {
        setInput(matches[0]);
      }
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(history[history.length - 1 - nextIndex] ?? '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }

  };

  const renderOutput = (line: TerminalLine) => {
    const toneClasses: Record<Tone, string> = {
      command: 'text-red-300',
      output: 'text-gray-200',
      success: 'text-emerald-400',
      error: 'text-rose-400',
      boot: 'text-red-400',
      info: 'text-blue-300'
    };

    return <div className={`whitespace-pre-wrap break-words leading-7 ${toneClasses[line.tone]}`}>{line.text}</div>;
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
    typeLine(soundEnabled ? 'Sound muted.' : 'Sound enabled.', 'info');
  };

  return (
    <section id="terminal" ref={sectionRef} className="py-24 relative z-10 scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="07 // SECURE CHANNEL"
          title="Spider Terminal"
          subtitle="A live console that boots on arrival, answers commands, and hides a few mini-games in the web."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <GlassCard className="overflow-hidden border-red-400/30 p-0 bg-[#0b0b0b]/95 w-full max-w-5xl h-[340px] mx-auto flex flex-col">
            <div className={`absolute inset-0 pointer-events-none ${theme === 'matrix' ? 'opacity-100' : 'opacity-40'}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(230,36,41,0.12),_transparent_45%)]" />
              <div className="absolute inset-0 matrix-rain" />
            </div>

            <div className="relative shrink-0 flex items-center justify-between px-4 py-3 border-b border-red-400/20 bg-[#111111]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center gap-2 text-red-300 font-mono text-sm">
                <FiCommand size={16} />
                <span>SPIDER TERMINAL v1.0</span>
              </div>
              <button
                type="button"
                onClick={toggleSound}
                className="rounded-full border border-red-400/20 bg-black/40 p-2 text-red-300"
              >
                {soundEnabled ? <FiVolume2 size={16} /> : <FiVolumeX size={16} />}
              </button>
            </div>

            <div className="relative flex-1 min-h-0 flex flex-col">
              <div className="scanlines absolute inset-0 pointer-events-none" />

              <div
                ref={outputRef}
                className="crt-flicker terminal-scroll flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-2 font-mono text-sm leading-7 p-4 sm:p-5"
                onClick={() => {
                  setUserEngaged(true);
                  inputRef.current?.focus({ preventScroll: true });
                }}
                role="presentation"
                tabIndex={0}
              >
                {!booted && bootStep < bootSequence.length && (
                  <div className="text-red-400">
                    {bootSequence.slice(0, bootStep).map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                )}

                {lines.map((line) => (
                  <div key={line.id}>{renderOutput(line)}</div>
                ))}
              </div>

              {booted && (
                <div className="relative shrink-0 border-t border-red-400/10 bg-[#0b0b0b] px-4 sm:px-5 py-2">
                  <div className="flex items-start gap-2 text-red-300 min-w-0 pl-1">
                    <span className="leading-7 shrink-0">{'>'}</span>
                    <form onSubmit={handleSubmit} className="flex-1 min-w-0">
                      <input
                        ref={inputRef}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent outline-none text-red-300 leading-7 px-0 py-0"
                        placeholder="Type a command..."
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </form>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <GlassCard className="border-red-400/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-red-500/10 p-2 text-red-300"><FiCpu size={16} /></div>
                <h3 className="font-display text-lg font-semibold text-white">Booted Experience</h3>
              </div>
              <p className="text-sm text-gray-300">Animated startup flow, responsive console UI, neon feedback, and live command parsing.</p>
            </GlassCard>
            <GlassCard className="border-red-400/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-300"><FiPlay size={16} /></div>
                <h3 className="font-display text-lg font-semibold text-white">Mini Games</h3>
              </div>
              <p className="text-sm text-gray-300">Play Snake, Tic Tac Toe, Guess, Memory, Typing, Hangman, and an AI Quiz right inside the terminal.</p>
            </GlassCard>
            <GlassCard className="border-red-400/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-300"><FiZap size={16} /></div>
                <h3 className="font-display text-lg font-semibold text-white">AI Chat</h3>
              </div>
              <p className="text-sm text-gray-300">Switch into chat mode with the <span className="text-red-300">chat</span> command for a streaming AI response.</p>
            </GlassCard>
          </div>
        </motion.div>
      </div>

      <style>{`
        .matrix-rain {
          background-image: linear-gradient(rgba(230,36,41,0.08) 1px, transparent 1px);
          background-size: 8px 8px;
          animation: drift 10s linear infinite;
          opacity: 0.55;
        }

        @keyframes drift {
          from { transform: translateY(-10%); }
          to { transform: translateY(10%); }
        }

        .scanlines {
          background: repeating-linear-gradient(to bottom, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 4px);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .crt-flicker {
          animation: flicker 3.5s infinite;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.98; }
          52% { opacity: 1; }
        }

        .terminal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(230,36,41,0.45) rgba(255,255,255,0.04);
        }

        .terminal-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .terminal-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.04);
        }

        .terminal-scroll::-webkit-scrollbar-thumb {
          background: rgba(230,36,41,0.45);
          border-radius: 9999px;
        }

        .terminal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(230,36,41,0.7);
        }
      `}</style>
    </section>
  );
}

function checkWinner(board: string[], player: string) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return lines.some((cells) => cells.every((index) => board[index] === player));
}

function findBestMove(board: string[]) {
  const emptyCells = board.map((cell, index) => (cell === ' ' ? index : -1)).filter((index) => index >= 0);
  return emptyCells[0] ?? 0;
}

function parseDirection(command: string) {
  const normalized = command.toLowerCase();
  if (normalized === 'w' || normalized === 'up') return { x: 0, y: -1 };
  if (normalized === 'a' || normalized === 'left') return { x: -1, y: 0 };
  if (normalized === 's' || normalized === 'down') return { x: 0, y: 1 };
  if (normalized === 'd' || normalized === 'right') return { x: 1, y: 0 };
  return null;
}
