interface DashboardCardProps {
    title: string;
    value: number;
  }
  
  const DashboardCard: React.FC<DashboardCardProps> = ({ title, value }) => {
    let textColor = '';
    let sign = '';
    let bgColor = ''

    if (title === 'Income') {
      textColor = 'text-green-500';
      sign = '+';
      bgColor = 'bg-green-50'
    } else if (title === 'Expense') {
      textColor = 'text-red-500';
      sign = '-';
      bgColor = 'bg-red-50'
    } else if (title === 'Balance') {
      if (value > 0) {
        textColor = 'text-green-500';
        sign = '+';
      } else if (value === 0) {
        textColor = 'text-brown-500';
        sign = '';
      } else {
        textColor = 'text-red-500';
        sign = '-';
      }
    }
  
    return (
      <div className={`border flex justify-between rounded-lg ${bgColor} shadow-sm p-8`}>
        <div className={`text-3xl ${textColor}`}>
          {sign}{value}
        </div>
        <div className={`md:text-3xl max-sm:text-xl flex items-center text-[#6b4226] hover:text-[#4d2e1b] font-semibold`}>{title}</div>
      </div>
    );
  };
  
  export default DashboardCard;
  