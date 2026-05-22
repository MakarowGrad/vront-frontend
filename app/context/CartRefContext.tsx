"use client";

import React, { createContext } from "react";

export const CartRefContext = createContext<React.RefObject<HTMLButtonElement> | null>(null);
