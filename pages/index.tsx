import Container from 'components/Container'
import Map from 'components/Map/Map'

export default function Home() {
  return (
    <Container>
      <div className='flex flex-col items-center justify-center inset-0'>
        <Map />
      </div>
    </Container>
  )
}
