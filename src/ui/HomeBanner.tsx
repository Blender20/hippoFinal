import Container from './Container'
import LinkButton from './LinkButton'

const HomeBanner = () => {
  return (
    <Container className='bg-home-banner-bg py-24 md:py-40 lg:py-52 lg:px-10 bg-no-repeat bg-cover flex flex-col gap-6'>
      <h2 className='text-6xl font-bold text-whiteText'>Hippo Labels</h2>
      <p className='text-lg font-semibold text-whiteText/90 max-w-[250px]'>
        Thank you for visiting Hippo Label
      </p>
      <LinkButton className='w-44 flex items-center justify-center bg-whiteText text-darkText hover:bg-orange-700 hover:text-whiteText duration-200' />
    </Container>
  )
}

export default HomeBanner
