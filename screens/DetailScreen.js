import React, { useState, useEffect } from 'react';

// --- Helper to load Google Fonts ---
const useGoogleFonts = () => {
  useEffect(() => {
    const fontFamilies = [
      'Lexend:wght@400;500;700;900',
      'Noto+Sans:wght@400;500;700;900',
    ];
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies.join('&family=')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const materialIconsLink = document.createElement('link');
    materialIconsLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
    materialIconsLink.rel = 'stylesheet';
    document.head.appendChild(materialIconsLink);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(materialIconsLink);
    };
  }, []);
};


// --- Constants ---
const COLORS = {
  primary: '#17cf17',
  secondary: '#f0f4f0',
  textPrimary: '#111811',
  textSecondary: '#6B7280',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  green50: '#F0FDF4',
  green100: '#DCFCE7',
  green600: '#16A34A',
  green700: '#15803D',
};

// --- Mock Data ---
const upcomingTasks = [
  {
    id: '1',
    plantName: 'Monstera',
    task: 'Water in 2 days',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=300',
  },
  {
    id: '2',
    plantName: 'Fiddle Leaf Fig',
    task: 'Fertilize in 5 days',
    image: 'https://images.unsplash.com/photo-1587329245131-489953a697b5?q=80&w=300',
  },
  {
    id: '3',
    plantName: 'Snake Plant',
    task: 'Water in 7 days',
    image: 'https://images.unsplash.com/photo-1588684343352-872a0a8afd34?q=80&w=300',
  },
];

const allPlants = [
  {
    id: '1',
    name: 'Monstera',
    status: 'Needs water',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400',
  },
  {
    id: '2',
    name: 'Fiddle Leaf Fig',
    status: 'Needs fertilizer',
    image: 'https://images.unsplash.com/photo-1600325881476-3f36021eaf73?q=80&w=400',
  },
  {
    id: '3',
    name: 'Snake Plant',
    status: 'Needs water',
    image: 'https://images.unsplash.com/photo-1593954252156-991d8b5c5e0d?q=80&w=400',
  },
  {
    id: '4',
    name: 'Pothos',
    status: 'Healthy',
    image: 'https://images.unsplash.com/photo-1618192025700-4824b2faf850?q=80&w=400',
  },
];

const careHistory = [
    { id: '1', type: 'Watered', date: 'September 1, 2025', icon: 'water_drop' },
    { id: '2', type: 'Fertilized', date: 'August 15, 2025', icon: 'science' },
    { id: '3', type: 'Repotted', date: 'July 1, 2025', icon: 'potted_plant' },
];

// --- Styles ---
const styles = {
  safeArea: {
    height: '100vh',
    backgroundColor: COLORS.white,
    fontFamily: 'Lexend, Noto Sans, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '430px', // Typical mobile width
    margin: '0 auto',
    border: `1px solid ${COLORS.gray200}`,
  },
  screenContainer: {
    padding: '0 16px',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottom: `1px solid ${COLORS.gray200}`,
    flexShrink: 0,
  },
  headerTitle: {
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '700',
    fontSize: 20,
    color: COLORS.textPrimary,
    margin: 0,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '600',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 16,
    margin: 0,
  },
  taskCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    border: `1px solid ${COLORS.gray200}`,
    width: '100%',
    cursor: 'pointer',
    textAlign: 'left',
  },
  taskImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
    objectFit: 'cover',
  },
  taskPlantName: {
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '500',
    fontSize: 16,
    color: COLORS.textPrimary,
    margin: 0,
  },
  taskDetail: {
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '500',
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
    margin: 0,
  },
  plantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },
  plantCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    border: `1px solid ${COLORS.gray200}`,
    cursor: 'pointer',
    padding: 0,
  },
  plantImage: {
    width: '100%',
    height: 128,
    objectFit: 'cover',
  },
  plantInfo: {
    padding: 12,
    textAlign: 'left',
  },
  plantName: {
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '600',
    fontSize: 15,
    color: COLORS.textPrimary,
    margin: 0,
  },
  plantStatus: {
    fontFamily: 'Lexend, sans-serif',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    margin: 0,
  },
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    height: 70,
    backgroundColor: COLORS.white,
    borderTop: `1px solid ${COLORS.secondary}`,
    flexShrink: 0,
  },
  navItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  navText: {
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '500',
    fontSize: 11,
    color: COLORS.textSecondary,
    margin: 0,
  },
  detailHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: COLORS.white,
    flexShrink: 0,
  },
  detailHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '700',
    fontSize: 18,
    color: COLORS.textPrimary,
    margin: 0,
  },
  headerButton: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  detailImage: {
    width: '100%',
    aspectRatio: '4 / 3',
    borderRadius: 16,
    objectFit: 'cover',
  },
  careGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
  },
  careItem: {
    backgroundColor: COLORS.green50,
    borderRadius: 12,
    padding: 12,
    textAlign: 'center',
  },
  careItemTitle: {
    marginTop: 4,
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '500',
    fontSize: 14,
    color: COLORS.textPrimary,
    margin: 0,
  },
  careItemSubtitle: {
    fontFamily: 'Lexend, sans-serif',
    fontSize: 12,
    color: COLORS.textSecondary,
    margin: 0,
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 0',
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.green100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  historyItemTitle: {
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '500',
    fontSize: 15,
    color: COLORS.textPrimary,
    margin: 0,
  },
  historyItemSubtitle: {
    fontFamily: 'Lexend, sans-serif',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    margin: 0,
  },
  stickyButtonContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTop: `1px solid ${COLORS.gray200}`,
    flexShrink: 0,
  },
  addCareButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: '14px 0',
    borderRadius: 12,
    gap: 8,
    width: '100%',
    border: 'none',
    cursor: 'pointer',
  },
  addCareButtonText: {
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '700',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  addPlantHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    flexShrink: 0,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  addPhotoContainer: {
    height: 128,
    borderRadius: 12,
    border: `2px dashed ${COLORS.gray300}`,
    backgroundColor: COLORS.gray50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    width: '100%',
    cursor: 'pointer',
  },
  addPhotoText: {
    marginTop: 4,
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '500',
    fontSize: 14,
    color: COLORS.textSecondary,
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingBottom: 24,
  },
  label: {
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '500',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    display: 'block',
  },
  input: {
    backgroundColor: COLORS.gray50,
    border: `1px solid ${COLORS.gray300}`,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Lexend, sans-serif',
    fontSize: 15,
    color: COLORS.textPrimary,
    width: '100%',
    boxSizing: 'border-box',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: '16px 0',
    borderRadius: 12,
    textAlign: 'center',
    width: '100%',
    border: 'none',
    cursor: 'pointer',
  },
  primaryButtonText: {
    fontFamily: 'Lexend, sans-serif',
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.white,
  },
};

// --- Reusable Components ---
const BottomNavBar = ({ activeScreen, onNavigate }) => (
  <nav style={styles.navBar}>
    <button onClick={() => onNavigate('Home')} style={styles.navItem}>
      <span className="material-symbols-outlined" style={{ color: activeScreen === 'Home' ? COLORS.primary : COLORS.textSecondary }}>eco</span>
      <p style={{ ...styles.navText, color: activeScreen === 'Home' ? COLORS.primary : COLORS.textSecondary }}>My Plants</p>
    </button>
    <button onClick={() => onNavigate('AddPlant')} style={styles.navItem}>
      <span className="material-symbols-outlined" style={{ color: activeScreen === 'AddPlant' ? COLORS.primary : COLORS.textSecondary }}>add_circle</span>
      <p style={{ ...styles.navText, color: activeScreen === 'AddPlant' ? COLORS.primary : COLORS.textSecondary }}>Add Plant</p>
    </button>
    <button onClick={() => {}} style={styles.navItem}>
      <span className="material-symbols-outlined" style={{ color: COLORS.textSecondary }}>settings</span>
      <p style={styles.navText}>Settings</p>
    </button>
  </nav>
);

// --- Screens ---
const HomeScreen = ({ onNavigate }) => {
  return (
    <div style={{ flex: 1, backgroundColor: COLORS.white, display: 'flex', flexDirection: 'column' }}>
      <header style={styles.header}>
        <div style={{width: 40}} />
        <h1 style={styles.headerTitle}>My Plants</h1>
        <button style={styles.addButton} onClick={() => onNavigate('AddPlant')}>
          <span className="material-symbols-outlined" style={{ color: COLORS.white, fontSize: 24 }}>add</span>
        </button>
      </header>
      <main style={{...styles.screenContainer, overflowY: 'auto', flex: 1}}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Upcoming Tasks</h2>
          {upcomingTasks.map(task => (
            <button key={task.id} style={styles.taskCard} onClick={() => onNavigate('Detail', task)}>
              <img src={task.image} alt={task.plantName} style={styles.taskImage} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={styles.taskPlantName}>{task.plantName}</p>
                <p style={styles.taskDetail}>{task.task}</p>
              </div>
              <span className="material-symbols-outlined" style={{ color: COLORS.gray400 }}>chevron_right</span>
            </button>
          ))}
        </section>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>All My Plants</h2>
          <div style={styles.plantGrid}>
            {allPlants.map(item => (
              <button key={item.id} style={styles.plantCard} onClick={() => onNavigate('Detail', item)}>
                <img src={item.image} alt={item.name} style={styles.plantImage} />
                <div style={styles.plantInfo}>
                  <p style={styles.plantName}>{item.name}</p>
                  <p style={styles.plantStatus}>{item.status}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const DetailScreen = ({ onNavigate, plant }) => {
  const plantData = plant || { name: 'Monstera Deliciosa', image: 'https://images.unsplash.com/photo-1598918239006-25931c221193?q=80&w=800' };
  return (
    <div style={{ flex: 1, backgroundColor: COLORS.white, display: 'flex', flexDirection: 'column' }}>
        <header style={styles.detailHeader}>
            <button onClick={() => onNavigate('Home')} style={styles.headerButton}>
                <span className="material-symbols-outlined" style={{fontSize: 22, color: COLORS.textPrimary}}>arrow_back_ios_new</span>
            </button>
            <h2 style={styles.detailHeaderTitle}>{plantData.name}</h2>
            <button style={styles.headerButton}>
                <span className="material-symbols-outlined" style={{fontSize: 24, color: COLORS.textPrimary}}>edit</span>
            </button>
        </header>
        <main style={{ overflowY: 'auto', flex: 1}}>
            <div style={{ padding: 16 }}>
                <img src={plantData.image} alt={plantData.name} style={styles.detailImage} />
            </div>

            <section style={{ paddingHorizontal: 16 }}>
                <h3 style={styles.sectionTitle}>Care Schedule</h3>
                <div style={styles.careGrid}>
                    <div style={styles.careItem}>
                        <span className="material-symbols-outlined" style={{ fontSize: 30, color: COLORS.green700 }}>water_drop</span>
                        <p style={styles.careItemTitle}>Watering</p>
                        <p style={styles.careItemSubtitle}>Every 7 days</p>
                    </div>
                    <div style={styles.careItem}>
                        <span className="material-symbols-outlined" style={{ fontSize: 30, color: COLORS.green700 }}>light_mode</span>
                        <p style={styles.careItemTitle}>Sunlight</p>
                        <p style={styles.careItemSubtitle}>Bright, indirect</p>
                    </div>
                    <div style={styles.careItem}>
                        <span className="material-symbols-outlined" style={{ fontSize: 30, color: COLORS.green700 }}>science</span>
                        <p style={styles.careItemTitle}>Fertilizing</p>
                        <p style={styles.careItemSubtitle}>Every 2 months</p>
                    </div>
                </div>
            </section>

             <section style={{ paddingHorizontal: 16, marginTop: 24, paddingBottom: 24 }}>
                <h3 style={styles.sectionTitle}>Care History</h3>
                <div style={{marginTop: 8}}>
                    {careHistory.map((item, index) => (
                        <div key={item.id} style={{...styles.historyItem, borderBottom: index === careHistory.length - 1 ? 'none' : `1px solid ${COLORS.gray200}`}}>
                            <div style={styles.historyIconContainer}>
                                <span className="material-symbols-outlined" style={{fontSize: 24, color: COLORS.green600}}>{item.icon}</span>
                            </div>
                            <div style={{flex: 1}}>
                                <p style={styles.historyItemTitle}>{item.type}</p>
                                <p style={styles.historyItemSubtitle}>{item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
         <div style={styles.stickyButtonContainer}>
            <button style={styles.addCareButton}>
                <span className="material-symbols-outlined" style={{fontSize: 20, color: COLORS.textPrimary}}>add_circle</span>
                <span style={styles.addCareButtonText}>Add Care Activity</span>
            </button>
        </div>
    </div>
  );
};

const AddPlantScreen = ({ onNavigate }) => {
  return (
    <div style={{ flex: 1, backgroundColor: COLORS.white, display: 'flex', flexDirection: 'column' }}>
        <header style={styles.addPlantHeader}>
            <button onClick={() => onNavigate('Home')} style={styles.closeButton}>
                <span className="material-symbols-outlined" style={{color: COLORS.textSecondary}}>close</span>
            </button>
            <h1 style={styles.headerTitle}>Add Plant</h1>
            <div style={{ width: 40 }} />
        </header>
        <main style={{...styles.screenContainer, overflowY: 'auto', flex: 1}}>
            <button style={styles.addPhotoContainer}>
                <span className="material-symbols-outlined" style={{fontSize: 40, color: COLORS.gray400}}>add_a_photo</span>
                <p style={styles.addPhotoText}>Add a photo</p>
            </button>
            
            <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label style={styles.label}>Plant Name</label>
                    <input style={styles.input} placeholder="e.g., Monstera Deliciosa" />
                </div>
                <div>
                    <label style={styles.label}>Plant Type</label>
                    <select style={styles.input}>
                      <option>Select plant type</option>
                      <option>Succulent</option>
                      <option>Fern</option>
                      <option>Ficus</option>
                    </select>
                </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                        <label style={styles.label}>Acquisition Date</label>
                        <input type="date" style={styles.input} />
                    </div>
                    <div>
                        <label style={styles.label}>First Watered</label>
                        <input type="date" style={styles.input} />
                    </div>
                </div>
                <div>
                    <label style={styles.label}>Sunlight</label>
                    <select style={styles.input}>
                      <option>Select sunlight preference</option>
                      <option>Low light</option>
                      <option>Indirect light</option>
                      <option>Direct sunlight</option>
                    </select>
                </div>
                <div>
                    <label style={styles.label}>Care Notes</label>
                    <textarea style={{...styles.input, height: 100 }} placeholder="e.g., Water once a week..."></textarea>
                </div>
            </form>
        </main>
        <div style={styles.stickyButtonContainer}>
            <button style={styles.primaryButton}>
                <span style={styles.primaryButtonText}>Add Plant</span>
            </button>
        </div>
    </div>
  );
};

// --- App ---
export default function App() {
  useGoogleFonts();
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [selectedPlant, setSelectedPlant] = useState(null);

  const handleNavigate = (screen, data = null) => {
    setSelectedPlant(data);
    setCurrentScreen(screen);
  };
  
  const renderScreen = () => {
    switch(currentScreen) {
        case 'Home':
            return <HomeScreen onNavigate={handleNavigate} />;
        case 'Detail':
            return <DetailScreen onNavigate={handleNavigate} plant={selectedPlant} />;
        case 'AddPlant':
            return <AddPlantScreen onNavigate={handleNavigate} />;
        default:
             return <HomeScreen onNavigate={handleNavigate} />;
    }
  }

  return (
    <div style={styles.safeArea}>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
          {renderScreen()}
          { (currentScreen === 'Home' || currentScreen === 'AddPlant') && 
            <BottomNavBar activeScreen={currentScreen} onNavigate={handleNavigate}/>
          }
        </div>
    </div>
  );
}

