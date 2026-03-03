"use client"

import { useEffect, useState } from "react"
import { Lightbulb } from "lucide-react"

const JOKES = [
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
]

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