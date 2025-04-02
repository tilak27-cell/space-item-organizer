
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Lightbulb, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecommendationProps {
  recommendation: {
    id: number;
    title: string;
    description: string;
    impact: string;
    timeEstimate: string;
  }
}

const OptimizerRecommendations = ({ recommendation }: RecommendationProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="p-3 rounded-md border border-gray-700 bg-black/20 backdrop-blur-sm"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-full bg-purple-500/20 text-purple-500">
            <Lightbulb size={16} />
          </div>
          <div>
            <h4 className="text-sm font-medium">{recommendation.title}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{recommendation.description}</p>
            <div className="flex items-center mt-2 space-x-3">
              <div className="flex items-center text-xs text-gray-400">
                <Clock size={12} className="mr-1" />
                <span>{recommendation.timeEstimate}</span>
              </div>
              <Badge className={`${getImpactColor(recommendation.impact)} text-xs`}>
                <Zap size={10} className="mr-1" />
                {recommendation.impact} impact
              </Badge>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <ChevronRight size={16} />
        </Button>
      </div>
    </motion.div>
  );
};

export default OptimizerRecommendations;
