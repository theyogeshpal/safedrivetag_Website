import React from 'react';
import { Link } from 'react-router-dom';
import { CarFront, Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#fcfaf5] px-6 py-24 relative overflow-hidden">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        
        {/* Error Code & Icon */}
        <div className="relative inline-block mb-6 group">
          <div className="text-[120px] md:text-[180px] font-black text-black/5 leading-none select-none tracking-tighter">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-orange-500 transform group-hover:scale-110 transition-transform duration-500">
            <CarFront size={80} strokeWidth={1.5} className="drop-shadow-2xl" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl md:text-5xl font-black text-black mb-6 tracking-tight">
          Wrong Turn!
        </h1>
        <p className="text-lg md:text-xl text-black/60 font-medium max-w-lg mx-auto mb-10 leading-relaxed">
          Looks like you've parked in the wrong spot or taken a wrong turn. The page you're looking for has been moved or doesn't exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="group relative inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-black text-base overflow-hidden transition-all hover:scale-105 hover:shadow-[0_10px_30px_rgba(34,197,94,0.3)] w-full sm:w-auto"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-400 to-green-600"></span>
            <span className="relative flex items-center gap-2">
              <Home className="w-5 h-5" /> Back to Home
            </span>
          </Link>
          
          <Link 
            to="/shop" 
            className="group inline-flex items-center justify-center gap-2 bg-white text-black border-2 border-black/10 px-8 py-3.5 rounded-full font-black text-base transition-all hover:bg-black/5 hover:border-black/20 hover:scale-105 w-full sm:w-auto"
          >
            <AlertTriangle className="w-5 h-5 text-orange-500" /> Get a Safety Tag
          </Link>
        </div>
      </div>
    </div>
  );
}
