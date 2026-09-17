#if UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace WamBamThankUMam.Editor
{
    [InitializeOnLoad]
    public static class WamBamProjectSetup
    {
        const string ScenePath = "Assets/Scenes/Main.unity";

        static WamBamProjectSetup()
        {
            EditorApplication.delayCall += Prepare;
        }

        [MenuItem("Wam Bam/Prepare Android Project")]
        public static void Prepare()
        {
            Directory.CreateDirectory("Assets/Scenes");

            if (!File.Exists(ScenePath))
            {
                Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
                EditorSceneManager.SaveScene(scene, ScenePath);
            }

            EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(ScenePath, true) };
            PlayerSettings.companyName = "Blu Studio";
            PlayerSettings.productName = "Wam Bam Thank U Mam";
            PlayerSettings.defaultInterfaceOrientation = UIOrientation.Portrait;
            PlayerSettings.runInBackground = false;
            PlayerSettings.SetApplicationIdentifier(UnityEditor.Build.NamedBuildTarget.Android, "com.blustudio.wambam");
            PlayerSettings.Android.bundleVersionCode = 5;
            PlayerSettings.bundleVersion = "0.5-alpha";
            PlayerSettings.Android.minSdkVersion = AndroidSdkVersions.AndroidApiLevel26;
            PlayerSettings.Android.targetSdkVersion = AndroidSdkVersions.AndroidApiLevelAuto;

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
        }
    }
}
#endif
