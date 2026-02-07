
import React from 'react';
import { ConnectionNode } from '../types';

interface SecurityPathProps {
  nodes: ConnectionNode[];
}

const SecurityPath: React.FC<SecurityPathProps> = ({ nodes }) => {
  return (
    <div className="p-8 rounded-[3rem] border border-[#00ff41]/10 bg-[#00ff41]/5 space-y-8">
      <div className="flex items-center justify-between">
         <h4 className="text-[10px] font-black uppercase tracking-widest text-[#00ff41]">Secure Pathway</h4>
         <div className="flex gap-1">
            <div className="w-1 h-1 bg-[#00ff41] rounded-full"></div>
            <div className="w-1 h-1 bg-[#00ff41] rounded-full animate-pulse"></div>
         </div>
      </div>

      <div className="space-y-6 relative before:absolute before:left-[1.125rem] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#00ff41]/40 before:via-[#00ff41]/10 before:to-transparent">
        {nodes.map((node, i) => (
          <div key={i} className="relative flex items-start gap-6 pl-10 group">
             <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#00ff41] bg-black group-hover:bg-[#00ff41] transition-all z-10"></div>
             <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase text-white group-hover:text-[#00ff41] transition-colors">{node.label}</span>
                   <span className="text-[8px] font-mono opacity-30">{node.latency}</span>
                </div>
                <div className="flex gap-4">
                   <span className="text-[8px] font-mono text-gray-500">{node.ip}</span>
                   <span className="text-[8px] font-black uppercase text-gray-700">{node.location}</span>
                </div>
             </div>
          </div>
        ))}
        <div className="relative flex items-start gap-6 pl-10">
           <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
           <div className="text-[10px] font-black uppercase text-blue-500">Resource Point</div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPath;
