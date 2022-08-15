import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import { useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';

import { toastAtom } from './hooks';
import { Toast } from 'primereact/toast';

import Providers from './providers';
import { HomeLayout } from './layouts/home';
import TestLayout from './layouts/test';

export default function App() {
  const toasts = useRef(null);
  const setMsgsAtom = useSetAtom(toastAtom)
  useEffect(() => setMsgsAtom(toasts.current), [])

  return (
    <Providers>
      <Toast ref={toasts} position="bottom-left" />
      <Router>
        <Routes>
          <Route path="/" element={<HomeLayout />} />
          <Route path="/test" element={<TestLayout/>} />
        </Routes>
      </Router>
    </Providers>
  );
}
