import { ReactNode } from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export interface IWrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: IWrapperProps) => {
  return (
    <>
      {children}
      <ToastContainer transition={Slide} autoClose={3000} />
    </>
  );
};

export default Wrapper;
