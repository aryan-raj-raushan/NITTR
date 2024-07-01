const Spinner = ({ size = 24 }) => (
    <div
      className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
  
  export default Spinner;
  