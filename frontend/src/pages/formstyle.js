
const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        backgroundImage: 'url("https://wallpaperbat.com/img/125814121-movie-poster-background-wallpaper.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
    heading: {
        color: '#fff',
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '30px',
        textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
    },
    formContainer: {
        width: '80%',
        maxWidth: '900px',
        padding: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    },
    formField: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '15px',
    },
    label: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#fff',
    },
    slider: {
        width: '100%',
        cursor: 'pointer',
    },
    checkboxGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
    },
    checkboxLabel: {
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        background: '#fde2e4',
        padding: '8px 12px',
        borderRadius: '6px',
    },
    checkboxField: {
        transform: 'scale(1.5)',
    },
    error: {
        color: 'red',
        fontSize: '14px',
    },
    messageSuccess: {
        color: '#4CAF50',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    messageError: {
        color: '#F44336',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    textarea: {
        width: '100%',
        minHeight: '120px',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        resize: 'vertical',
        fontSize: '14px',
        color: '#000',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(5px)',
    },
    submitButton: {
        width: '100%',
        padding: '15px',
        fontSize: '18px',
        backgroundColor: 'rgba(255, 77, 121, 0.8)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: '0.3s',
    }
    
    
};

export default styles