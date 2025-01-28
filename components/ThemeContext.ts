import React, { useState } from "react";

export const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {},
});


// import React, { useState, useContext, ReactNode, createContext } from 'react';

// // Define the Theme type
// type ThemeType = 'light' | 'dark';

// // Define the shape of your context
// interface ThemeContextProps {
//   theme: ThemeType;
//   toggleTheme: () => void;
// }

// // Create the context with default values
// export const ThemeContext = createContext<ThemeContextProps>({
//   theme: 'light',
//   toggleTheme: () => {},
// });

// export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [theme, setTheme] = useState<ThemeType>('light');

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

