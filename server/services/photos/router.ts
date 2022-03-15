import express from 'express'
import { photoService } from '@/services'

/**
 * base route: /photos
 */
const router = express.Router({ mergeParams: true })

router.get('', async (req, res) => {
  const response = await photoService.getMany()

  res.json(response)
})

router.get('/:id', async (req, res) => {
  const response = await photoService.getOne({
    id: req.params.id,
  })

  res.json(response)
})

router.post('', async (req, res) => {
  const response = await photoService.addOne({
    name: req.body.name,
    description: req.body.description,
    url: req.body.url,
  })

  res.json(response)
})

router.delete('/:id', async (req, res) => {
  const response = await photoService.removeOne({
    id: req.params.id,
  })

  res.json(response)
})

export default router