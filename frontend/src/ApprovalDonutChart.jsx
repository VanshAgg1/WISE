import React from 'react';
import './FinancingReview.css';

const ApprovalDonutChart = ({ approval_chance }) => {
  console.log(approval_chance);
  const getArrowAngle = (chance) => {
      // Ensure chance is a number and within 0-100 range
      const percentage = Math.min(Math.max(Number(chance), 0), 100);
      
      // Map percentage (0-100) to angle (-90 to 90)
      // -90 represents 0%, 0 represents 50%, and 90 represents 100%
      const angle = (percentage * 180 / 100) - 90;
      
      return angle;
  };

  return (
    <div className="approval-donut-wrapper">
      <svg viewBox="0 0 200 110" className="approval-donut">
        {/* Segment 1: Low (Red) */}
        <path
          d="M10,100 A90,90 0 0,1 70,19.5"
          fill="none"
          stroke="#d93025"
          strokeWidth="20"
        />

        {/* Segment 2: Medium (Orange) */}
        <path
          d="M70,19.5 A90,90 0 0,1 130,19.5"
          fill="none"
          stroke="#fbbc04"
          strokeWidth="20"
        />

        {/* Segment 3: High (Green) */}
        <path
          d="M130,19.5 A90,90 0 0,1 190,100"
          fill="none"
          stroke="#34a853"
          strokeWidth="20"
        />

        {/* Arrow pointing to approval level */}
        <g transform={`rotate(${getArrowAngle(approval_chance)}, 100, 100)`}>
          <polygon
            points="100,35 95,50 105,50"
            fill="#333"
          />
        </g>

        {/* Approval text */}
        <text
          x="100"
          y="105"
          textAnchor="middle"
          className={`donut-text ${approval_chance}`}
        >
          {approval_chance}%
        </text>
      </svg>
    </div>
  );
};

export default ApprovalDonutChart;
