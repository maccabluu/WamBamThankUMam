#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;

namespace WamBamThankUMam.Editor
{
    [InitializeOnLoad]
    public static class WamBamEncodedAssetDecoder
    {
        static WamBamEncodedAssetDecoder()
        {
            EditorApplication.delayCall += EnsureDecodedAssets;
        }

        public static void EnsureDecodedAssets()
        {
            try
            {
                DecodeFolder("Assets/WamBam/Resources/Encoded/Menu", "Assets/WamBam/Resources/Art/MenuReference.jpg");
                DecodeFolder("Assets/WamBam/Resources/Encoded/Gameplay", "Assets/WamBam/Resources/Art/GameplayReference.jpg");

                string[] names = { "heart", "lipstick", "cherries", "diamond", "star", "heel" };
                foreach (string name in names)
                {
                    DecodeFolder(
                        $"Assets/WamBam/Resources/Encoded/Tiles/{name}",
                        $"Assets/WamBam/Resources/Tiles/{name}.jpg"
                    );
                }

                AssetDatabase.Refresh();
                Debug.Log("Wam Bam encoded artwork decoded successfully.");
            }
            catch (Exception ex)
            {
                Debug.LogError("Wam Bam artwork decode failed: " + ex);
                throw;
            }
        }

        private static void DecodeFolder(string sourceFolder, string outputPath)
        {
            if (!Directory.Exists(sourceFolder))
                throw new DirectoryNotFoundException(sourceFolder);

            string[] parts = Directory.GetFiles(sourceFolder, "*.txt")
                .OrderBy(path => path, StringComparer.Ordinal)
                .ToArray();

            if (parts.Length == 0)
                throw new FileNotFoundException("No encoded chunks found in " + sourceFolder);

            var encoded = new System.Text.StringBuilder();
            foreach (string part in parts)
                encoded.Append(File.ReadAllText(part).Trim());

            byte[] bytes = Convert.FromBase64String(encoded.ToString());
            Directory.CreateDirectory(Path.GetDirectoryName(outputPath));
            File.WriteAllBytes(outputPath, bytes);
            AssetDatabase.ImportAsset(outputPath, ImportAssetOptions.ForceUpdate);
        }
    }
}
#endif
