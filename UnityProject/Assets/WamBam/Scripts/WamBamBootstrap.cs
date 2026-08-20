using UnityEngine;

namespace WamBamThankUMam
{
    public static class WamBamBootstrap
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Boot()
        {
            if (Object.FindFirstObjectByType<WamBamGame>() != null)
                return;

            var root = new GameObject("Wam Bam Thank U Mam");
            Object.DontDestroyOnLoad(root);
            root.AddComponent<WamBamGame>();
        }
    }
}
