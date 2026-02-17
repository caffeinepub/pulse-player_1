import { useTheme } from 'next-themes';

export function AppBrandHeader() {
  const { theme } = useTheme();
  
  const bgImage = theme === 'dark' 
    ? '/assets/generated/hero-bg-dark.dim_1440x900.png'
    : '/assets/generated/hero-bg-light.dim_1440x900.png';

  return (
    <div 
      className="relative h-48 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        <img 
          src="/assets/generated/app-logo.dim_512x512.png" 
          alt="Pulse Player" 
          className="w-20 h-20 mb-3"
        />
        <h1 className="text-3xl font-bold">Pulse Player</h1>
        <p className="text-muted-foreground mt-1">Your music, your way</p>
      </div>
    </div>
  );
}
