import React, { useState, useEffect, useRef } from 'react';

export const SteamLocomotive: React.FC<{ onExit: () => void, scrollToBottom: () => void }> = ({ onExit, scrollToBottom }) => {
    const [position, setPosition] = useState(100); // Percentage
    const animationRef = useRef<number>(0);

    useEffect(() => {
        scrollToBottom();
        const animate = () => {
            setPosition(prev => {
                if (prev <= -50) {
                    onExit();
                    return -50;
                }
                return prev - 0.8;
            });
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationRef.current);
    }, [onExit, scrollToBottom]);

    const train = `
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|      _________________
   /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A
  |      |  |   H  |__--------------------| [___] |   =|                        |
  | ________|___H__/__|_____/[][]~\\_______|       |   -|                        |
  |/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_
 |/-=|___|=O=====O=====O=====O   |_____/~\\___/          |_D__D__D_|  |_D__D__D_|
  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/               \\_/   \\_/    \\_/   \\_/
`;

    return (
        <div className="overflow-hidden py-4">
            <pre 
                className="font-mono text-xs sm:text-sm leading-none whitespace-pre text-white"
                style={{ transform: `translateX(${position}%)` }}
            >
                {train}
            </pre>
        </div>
    );
};

