import React from 'react';

export const CowsayOutput: React.FC<{ args: string[] }> = ({ args }) => {
    const text = args.length > 0 ? args.join(' ') : "Moo! I'm a virtual cow living in your browser.";
    const len = text.length + 2;
    const dash = '-'.repeat(len);
    
    return (
        <pre className="text-green-400 font-mono text-xs sm:text-sm leading-none my-2">
{`
 ${'_'.repeat(len)}
< ${text} >
 ${dash}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`}
        </pre>
    );
};

export const FortuneOutput = () => {
    const quotes = [
        "A bug in the code is worth two in the documentation.",
        "It works on my machine.",
        "Experience is the name everyone gives to their mistakes.",
        "Java is to JavaScript what car is to Carpet.",
        "Code never lies, comments sometimes do.",
        "First, solve the problem. Then, write the code.",
        "Simplicity is the soul of efficiency.",
        "Make it work, make it right, make it fast."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return <div className="text-cyan-300 italic border-l-2 border-cyan-500 pl-3 my-2">{randomQuote}</div>
};

export const CoffeeOutput = () => (
    <div className="my-4 font-mono text-yellow-500 text-sm">
        <pre className="leading-none mb-2">
{`
    (  )   (   )  )
     ) (   )  (  (
     ( )  (    ) )
     _____________
    <_____________> ___
    |             |/ _ \\
    |               | | |
    |               |_| |
    |             |\\___/
    \\_____________/-'
`}
        </pre>
        <div className="mt-2 text-green-400">
            <span className="animate-pulse">Status:</span> Brewing perfect code...
        </div>
        <div className="text-slate-400 text-xs mt-1">
            Caffeine Level: 9000%
        </div>
    </div>
);

export const JokeOutput: React.FC = () => {
    const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "There are 10 types of people in the world: Those who understand binary, and those who don't."
    ];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    return <span className="text-cyan-300">{randomJoke}</span>;
};

export const WeatherOutput: React.FC = () => {
    return <span className="text-blue-300">Current weather in Server Room: 21°C, 0% chance of sunlight, 100% chance of bugs.</span>;
};

export const CoinflipOutput: React.FC = () => {
    const result = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
    return <span className="font-bold text-yellow-400">{result}</span>;
};

