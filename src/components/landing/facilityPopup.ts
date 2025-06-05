
import { Facility } from './types';

// Create facility popup content
export const createFacilityPopup = (facility: Facility) => {
  const statusColor = facility.status === 'in_stock' ? '#10b981' : 
                     facility.status === 'partial' ? '#f59e0b' : '#ef4444';
  
  const statusText = facility.status === 'in_stock' ? 'In Stock' :
                    facility.status === 'partial' ? 'Partial Stock' : 'Stock Out';

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 250px; max-width: 300px;">
      <div style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${facility.name}</h3>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280; text-transform: capitalize;">${facility.type.replace('_', ' ')}</p>
      </div>
      
      <div style="margin-bottom: 12px;">
        <div style="display: flex; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 12px; font-weight: 500; color: #374151; margin-right: 8px;">Status:</span>
          <span style="background-color: ${statusColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">${statusText}</span>
        </div>
        
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
          <strong>Location:</strong> ${facility.wereda}, ${facility.zone}
        </div>
        
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
          <strong>Stock Availability:</strong> ${facility.stockAvailability}%
        </div>
        
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
          <strong>Tracer Items:</strong> ${facility.tracerItems.available}/${facility.tracerItems.total} available
        </div>
        
        <div style="font-size: 12px; color: #6b7280;">
          <strong>Last Reported:</strong> ${new Date(facility.lastReported).toLocaleDateString()}
        </div>
      </div>
      
      <div style="display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
        <button 
          onclick="window.selectFacility('${facility.id}')"
          style="flex: 1; background-color: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; transition: background-color 0.2s;"
          onmouseover="this.style.backgroundColor='#2563eb'"
          onmouseout="this.style.backgroundColor='#3b82f6'"
        >
          View Details
        </button>
        <button 
          onclick="window.hidePopup()"
          style="background-color: #6b7280; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; transition: background-color 0.2s;"
          onmouseover="this.style.backgroundColor='#4b5563'"
          onmouseout="this.style.backgroundColor='#6b7280'"
        >
          Hide
        </button>
      </div>
    </div>
  `;
};
