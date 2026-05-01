import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTranslation } from './useTranslation'

vi.mock('./SystemSettings', () => ({
  useSystemSettings: () => ({
    settings: { language: 'en' }
  })
}))

describe('useTranslation Regression Tests', () => {
  it('should translate keys correctly to English', () => {
    const { result } = renderHook(() => useTranslation())
    expect(result.current.t('Start')).toBe('Start')
    expect(result.current.t('My Computer')).toBe('My Computer')
  })
})