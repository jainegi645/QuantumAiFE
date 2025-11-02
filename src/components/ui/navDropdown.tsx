import { ReactNode } from 'react';

interface DropdownSection {
  title: string;
  items: {
    icon?: ReactNode;
    text: string;
    link?: string;
  }[];
}

interface NavDropdownProps {
  sections: DropdownSection[];
  isOpen: boolean;
}

export const NavDropdown = ({ sections, isOpen }: NavDropdownProps) => {
  return (
    <div
      className={`fixed left-0 bg-white shadow-lg
      border-t border-gray-100 mt-[-50px]
      transform transition-all duration-200 ease-in-out z-40 ${
        isOpen ? 'opacity-100 translate-y-16' : 'opacity-0 translate-y-0 pointer-events-none'
      }`}
    >
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-3 gap-12">
          {sections.map((section, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href={item.link || '#'}
                      className="group flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      {item.icon && <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-lg">{item.icon}</span>}
                      <span className="text-[15px] font-medium">{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};