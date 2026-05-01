import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { BootScreen } from './BootScreen'

describe('BootScreen Regression Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should display ASUS boot screen for 15 seconds, then Windows for 5 seconds', () => {
    const onDone = vi.fn()
    render(<BootScreen onDone={onDone} />)

    // Initial phase: ASUS screen
    expect(screen.getByText('ASUS')).toBeDefined()
    expect(screen.getByText('IN SEARCH OF INCREDIBLE')).toBeDefined()

    // Advance 14.9s
    act(() => {
      vi.advanceTimersByTime(14900)
    })
    expect(onDone).not.toHaveBeenCalled()
    expect(screen.queryByText('ASUS')).not.toBeNull()

    // Advance to 15s - phase switches to windows
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(screen.queryByText('ASUS')).toBeNull()
    expect(screen.getAllByText(/Microsoft/)).toBeDefined()

    // Advance another 4.9s
    act(() => {
      vi.advanceTimersByTime(4900)
    })
    expect(onDone).not.toHaveBeenCalled()

    // Advance to 20s total (15s + 5s)
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})