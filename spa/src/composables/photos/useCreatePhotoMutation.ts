import { useMutation, useQueryClient } from 'vue-query'
import * as PhotoService from '@/services/photoService'
import { I_PhotoNew } from '@/types'

/**
 * Create a new photo
 * @param args.photoData - the data for a new photo
 */
export const useCreatePhotoMutation = () => {
  const queryClient = useQueryClient()

  async function mutationFunction(args: {
    photoData: I_PhotoNew
  }) {
    const { photoData } = args

    return PhotoService.postOne({ photoData })
  }

  return useMutation(mutationFunction, {
    onSuccess() {
      queryClient.invalidateQueries('photos')
    },
  })
}
