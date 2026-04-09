import { useMemo } from 'react';
import L from 'leaflet';

/**
 * Hook to manage and memoize Map Icons for performance optimization
 */
export const useMapIcons = () => {
  return useMemo(() => {
    // Dorado Style for Main Checkpoint
    const checkpointIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: #EAB308; 
          width: 14px; 
          height: 14px; 
          border-radius: 50%; 
          border: 3px solid white; 
          box-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Factory for Patient Icons
    const createPatientIcon = (isSelected) => L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center">
          ${isSelected ? `
            <div class="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>
          ` : ''}
          <div style="
            background-color: ${isSelected ? '#2563EB' : '#60A5FA'}; 
            width: ${isSelected ? '16px' : '12px'}; 
            height: ${isSelected ? '16px' : '12px'}; 
            border-radius: 50%; 
            border: 2px solid white; 
            box-shadow: 0 0 8px rgba(37, 99, 235, 0.4);
            transition: all 0.3s;
          "></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    // Factory for Professional Visit Icons
    const createProfessionalVisitIcon = (order, dateColor) => L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center group cursor-pointer">
          <div style="
            background-color: ${dateColor}; 
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            border: 2px solid white; 
            box-shadow: 0 0 10px ${dateColor}60;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 900;
            font-size: 11px;
            transition: all 0.3s;
          " class="group-hover:scale-110">${order}</div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    // Static icons that can be reused directly
    const patientIconRegular = createPatientIcon(false);
    const patientIconSelected = createPatientIcon(true);

    return {
      checkpointIcon,
      patientIconRegular,
      patientIconSelected,
      createPatientIcon,
      createProfessionalVisitIcon
    };
  }, []);
};
