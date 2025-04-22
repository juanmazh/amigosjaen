function Card({ children }) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-4 mb-4 border border-purple-100 hover:shadow-xl transition-all duration-300">
        {children}
      </div>
    );
  }
  