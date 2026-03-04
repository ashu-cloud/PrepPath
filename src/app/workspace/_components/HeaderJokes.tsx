"use client"

import { useEffect, useState } from "react"
import { Lightbulb } from "lucide-react"

const JOKES = [
  // --- Original Programming Jokes ---
  "Why do programmers prefer dark mode? Light attracts bugs. 🐛",
  "A SQL query walks into a bar and asks two tables: 'Can I join you?'",
  "Why do Java developers wear glasses? Because they don't C#.",
  "There are 10 types of people: those who understand binary and those who don't.",
  "A programmer's wife says 'get a gallon of milk, if they have eggs get a dozen.' He returns with 12 gallons of milk.",
  "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
  "How do you comfort a JavaScript bug? You console it.",
  "Why did the developer go broke? Because he used up all his cache.",
  "A good programmer is someone who looks both ways before crossing a one-way street.",
  "Debugging: being the detective in a crime movie where you're also the murderer.",
  "99 little bugs in the code, 99 little bugs... take one down, patch it around... 127 little bugs in the code.",
  "Why do programmers always mix up Halloween and Christmas? Because Oct 31 = Dec 25.",
  "I would tell you a UDP joke but you might not get it.",
  "Why did the function break up with the loop? It found someone with better closure.",
  "A byte walks into a bar looking pale. The bartender asks: 'What's wrong?' 'Bit flip,' it says.",
  "Why did the developer quit his job? He didn't get arrays.",
  "What's a computer's favorite snack? Microchips.",
  "Why was the CSS developer depressed? Because he kept floating and nobody cleared him.",
  "To understand recursion, you must first understand recursion.",
  "Python developers don't grow old — they just get more pythonic.",
  "What did the programmer say to the rubber duck? 'It's not a bug, it's a feature.'",
  "Why can't programmers tell jokes? They always forget to return after a punchline.",
  "How many programmers does it take to change a light bulb? None — that's a hardware problem.",
  "Why did the React dev go to therapy? Too many unresolved props.",
  "Git push origin main... and pray. 🙏",

  // --- New General & Clever Jokes ---
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "Why don't scientists trust atoms? Because they make up everything!",
  "Parallel lines have so much in common. It's a shame they'll never meet.",
  "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
  "What do you call fake spaghetti? An impasta.",
  "Why did the scarecrow win an award? Because he was outstanding in his field.",
  "I'm reading a book on anti-gravity. I just can't put it down.",
  "Why do melons have weddings? Because they cantaloupe.",
  "What do you call a bear with no teeth? A gummy bear.",
  "I used to play piano by ear, but now I use my hands.",
  "Why did the math book look sad? Because of all of its problems.",
  "I told my doctor that I broke my arm in two places. He told me to stop going to those places.",
  "What did the left eye say to the right eye? Between you and me, something smells.",
  "How does a penguin build its house? Igloos it together.",
  "What do you call a magic dog? A labracadabrador.",
  "Did you hear about the claustrophobic astronaut? He just needed a little space.",
  "I invented a new word! Plagiarism!",
  "Why don't skeletons fight each other? They don't have the guts.",
  "What has a wealth of knowledge but no voice? A library.",
  "Why did the coffee file a police report? It got mugged.",
  "How do you organize a space party? You planet.",
  "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
  "I'm terrified of elevators, so I'm going to start taking steps to avoid them.",
  "Why did the bicycle fall over? Because it was two-tired.",
  "What do you call a factory that makes okay products? A satisfactory."
];

export default function HeaderJoke() {
  const [joke, setJoke] = useState("")
  const [visible, setVisible] = useState(true)

  const pickJoke = () => JOKES[Math.floor(Math.random() * JOKES.length)]

  useEffect(() => {
    setJoke(pickJoke())

    const interval = setInterval(() => {
      // Fade out
      setVisible(false)
      setTimeout(() => {
        setJoke(pickJoke())
        setVisible(true)
      }, 500)
    }, 12000)

    return () => clearInterval(interval)
  }, [])

  if (!joke) return null

  return (
    <div className="hidden max-w-sm items-center gap-2 xl:flex">
      <Lightbulb className="h-3.5 w-3.5 flex-shrink-0 text-amber-400/60" />
      <p
        className="truncate font-mono text-[0.65rem] text-white/60 transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
        title={joke}
      >
        {joke}
      </p>
    </div>
  )
}