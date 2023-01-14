import { useMutation, useQueryClient } from 'vue-query'

import { I_Photo } from '@/models'
import * as PhotoService from '@/services/photoService'

/**
 * Delete a photo
 * @param args.id - the id of the photo to delete
 */
export const useDeletePhotoMutation = () => {
  const queryClient = useQueryClient()

  async function mutationFunction(args: {
    id: I_Photo['id']
  }) {
    const { id } = args

    return PhotoService.deleteOne({ id })
  }

  return useMutation(mutationFunction, {
    onSuccess() {
      queryClient.invalidateQueries('photos')
    },
  })
}
