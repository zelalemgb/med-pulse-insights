
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, HelpCircle, FileText, ExternalLink, Mail, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSystemSettings } from '@/hooks/useSystemSettings';

const Footer = () => {
  const { user } = useAuth();
  const { appVersion, systemStatus } = useSystemSettings();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Navigation',
      links: [
        { label: 'Dashboard', to: '/dashboard', internal: true },
        { label: 'Facilities', to: '/facilities', internal: true },
        { label: 'Analytics', to: '/analytics', internal: true },
        { label: 'Role Testing', to: '/role-testing', internal: true },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', to: '#', icon: FileText },
        { label: 'API Reference', to: '#', icon: ExternalLink },
        { label: 'User Guide', to: '#', icon: HelpCircle },
        { label: 'System Status', to: '#', icon: ExternalLink },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', to: '#', icon: HelpCircle },
        { label: 'Contact Support', to: 'mailto:support@forlab.com', icon: Mail },
        { label: 'Emergency Line', to: 'tel:+1-800-FORLAB', icon: Phone },
        { label: 'Training Resources', to: '#', icon: FileText },
      ]
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Forlab+
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4 max-w-xs">
              Advanced laboratory analytics and supply chain management platform for healthcare facilities.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  v{appVersion}
                </Badge>
                <span className="text-xs text-gray-500">Production</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-xs text-gray-600 capitalize">
                  {systemStatus === 'operational' ? 'All systems operational' : systemStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.internal ? (
                      <Link
                        to={link.to}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2"
                      >
                        {link.icon && <link.icon className="w-4 h-4" />}
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.to}
                        target={link.to.startsWith('http') ? '_blank' : undefined}
                        rel={link.to.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2"
                      >
                        {link.icon && <link.icon className="w-4 h-4" />}
                        {link.label}
                        {link.to.startsWith('http') && <ExternalLink className="w-3 h-3" />}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600">
              <p>© {currentYear} Forlab+ Platform. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-gray-900 transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-gray-900 transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-gray-900 transition-colors duration-200">
                  Compliance
                </a>
              </div>
            </div>
            
            {user && (
              <div className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
