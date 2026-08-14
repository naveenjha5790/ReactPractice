import pl from "../components/pl"
import Entry from "../components/entry"
import Header from "../components/header"
function App() {
  const plcurrent=pl.map((item)=>{
    return (
      <Entry 
      key={item.id}
      link={item.link}
      club={item.club}
      Hg={item.Hg}
      manager={item.manager}
      expectations={item.expectations}
      preview={item.preview}
      predictions={item.predictions}
      MVP={item.MVP}
        />
    )
  })
  return (
    <main>
      <Header />
      <p><i>As the premier league's new season is going to start on 22 August. Let us look at clubs participating in this season along with their expectations and how are they diffrent from last season.</i></p>
      <div className="grid">
      {plcurrent}
      </div>
    </main>
  )
}
  

export default App
