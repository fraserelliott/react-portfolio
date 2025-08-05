// TODO: clickable with philosophy page

const OpenSourceBadge = () => {
  return (
    <span style={{
      display: 'inline-block',
      backgroundColor: 'var(--bg-secondary)',
      fontSize: '0.75rem',
      padding: '4px 10px',
      marginTop: '4px',
      borderRadius: '1em',
      fontWeight: '500',
      width: 'fit-content',
      textAlign: 'center'
    }}>
      🔓 Open Source by Default
    </span>
  );
};

export default OpenSourceBadge;