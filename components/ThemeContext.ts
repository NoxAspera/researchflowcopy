import React, { useState } from "react";

export const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {},
});


