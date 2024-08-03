import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
  return (
    <Loader2 className={clsx('animate-spin', className)} />
  );
};

export default Loader;
