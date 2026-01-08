import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const SocialSidebar = () => {
    const { isDark } = useTheme();

    const socialLinks = [
        {
            name: 'Facebook',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
            ),
            url: 'https://facebook.com',
            color: 'hover:bg-blue-600'
        },
        {
            name: 'WhatsApp',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.435 5.628 1.435h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
            ),
            url: 'https://wa.me/yourphonenumber',
            color: 'hover:bg-green-500'
        },
        {
            name: 'TikTok',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.14 1.01.23 2.06.94 2.81.91.93 2.3 1.3 3.55 1.11 1.15-.17 2.19-.94 2.72-1.97.28-.52.41-1.11.41-1.71-.05-4.24-.01-8.48-.02-12.72z"/>
                </svg>
            ),
            url: 'https://tiktok.com',
            color: 'hover:bg-pink-600'
        }
    ];

    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-4">
            {socialLinks.map((link, index) => (
                <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl backdrop-blur-md border border-white/10 transition-all duration-300 group ${
                        isDark ? 'bg-white/5 text-white' : 'bg-black/5 text-gray-900'
                    } ${link.color}`}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1, type: 'spring', stiffness: 100 }}
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <span className="group-hover:text-white transition-colors">
                        {link.icon}
                    </span>
                    
                    {/* Tooltip */}
                    <span className="absolute left-16 px-3 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {link.name}
                    </span>
                </motion.a>
            ))}
            
            {/* Vertical Line */}
            <motion.div 
                className={`w-px h-24 mx-auto mt-4 transition-colors ${isDark ? 'bg-white/10' : 'bg-black/10'}`}
                initial={{ height: 0 }}
                animate={{ height: 96 }}
                transition={{ delay: 1.5, duration: 1 }}
            />
        </div>
    );
};

export default SocialSidebar;
