import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import CreatePage from '@/app/create/page'
import { useAppStore } from '@/store/useAppStore'

// Mock du router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock du store
jest.mock('@/store/useAppStore', () => ({
  useAppStore: jest.fn()
}))

describe('App Creation Flow', () => {
  const mockPush = jest.fn()
  const mockSetBusinessInfo = jest.fn()
  const mockSetTemplate = jest.fn()
  const mockNextStep = jest.fn()

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useAppStore as jest.Mock).mockReturnValue({
      generatorStep: 1,
      setBusinessInfo: mockSetBusinessInfo,
      setTemplate: mockSetTemplate,
      nextStep: mockNextStep
    })
  })

  it('should complete step 1 - Business Info', async () => {
    render(<CreatePage />)

    // Remplir le formulaire
    const nameInput = screen.getByLabelText(/nom de l'entreprise/i)
    const descInput = screen.getByLabelText(/description/i)
    const nextButton = screen.getByRole('button', { name: /suivant/i })

    fireEvent.change(nameInput, { target: { value: 'Mon Restaurant' } })
    fireEvent.change(descInput, { target: { value: 'Restaurant gastronomique' } })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(mockSetBusinessInfo).toHaveBeenCalledWith({
        name: 'Mon Restaurant',
        description: 'Restaurant gastronomique'
      })
      expect(mockNextStep).toHaveBeenCalled()
    })
  })

  it('should select a template in step 2', async () => {
    (useAppStore as jest.Mock).mockReturnValue({
      generatorStep: 2,
      setTemplate: mockSetTemplate,
      nextStep: mockNextStep
    })

    render(<CreatePage />)

    const restaurantTemplate = screen.getByText(/restaurant/i).closest('button')
    fireEvent.click(restaurantTemplate!)

    await waitFor(() => {
      expect(mockSetTemplate).toHaveBeenCalledWith('restaurant')
      expect(mockNextStep).toHaveBeenCalled()
    })
  })

  it('should validate required fields', async () => {
    render(<CreatePage />)

    const nextButton = screen.getByRole('button', { name: /suivant/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText(/champ requis/i)).toBeInTheDocument()
      expect(mockNextStep).not.toHaveBeenCalled()
    })
  })
})