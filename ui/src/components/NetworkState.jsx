function ConnectionState({ size, color, title }) {
  return <svg
    width={size}
    height={size}
    className="h-full"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <g>
      <path fill={color} d="M24,25a15.1,15.1,0,0,0-11.7,5.5A2,2,0,0,0,15.4,33,11.5,11.5,0,0,1,24,29a11.5,11.5,0,0,1,8.6,4,2,2,0,1,0,3.1-2.5A15.1,15.1,0,0,0,24,25Z"/>
      <path fill={color} d="M24,17A22.9,22.9,0,0,0,7.5,23.9a2,2,0,0,0-.2,2.6,1.9,1.9,0,0,0,3,.2,19.3,19.3,0,0,1,27.4,0,1.9,1.9,0,0,0,3-.2,2,2,0,0,0-.2-2.6A22.9,22.9,0,0,0,24,17Z"/>
      <path fill={color} d="M45.4,17.4a31.5,31.5,0,0,0-42.8,0,2.1,2.1,0,0,0-.2,2.7h0a1.9,1.9,0,0,0,3,.2,27.3,27.3,0,0,1,37.2,0,1.9,1.9,0,0,0,3-.2h0A2.1,2.1,0,0,0,45.4,17.4Z"/>
      <circle fill={color} cx="24" cy="38" r="5"/>
    </g>
  </svg>
}

export default ConnectionState;
