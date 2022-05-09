import './App.scss';
import Navigation from './components/navigation/navigation';
import Greetings from './components/greetings/greetings';
import Search from './components/search/search';

function App() {
  return (
    <div className="App">
      <Navigation />
      <div className='container'>
        <Greetings />
        <Search />
      </div>
    </div>
  );
}

export default App;
