function Container({ children }) {
  return (
    <div className="container mx-auto max-w-lg px-4 selection:bg-primary selection:text-primary-content">
      {children}
    </div>
  );
}

export default Container;
