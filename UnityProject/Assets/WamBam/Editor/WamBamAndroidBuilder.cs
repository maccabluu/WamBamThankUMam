#if UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace WamBamThankUMam.Editor
{
    public static class WamBamAndroidBuilder
    {
        [MenuItem("Wam Bam/Build Android APK")]
        public static void BuildAndroidApk()
        {
            WamBamProjectSetup.Prepare();
            string outDir = Path.GetFullPath(Path.Combine(Application.dataPath, "../Builds/Android"));
            Directory.CreateDirectory(outDir);
            string outPath = Path.Combine(outDir, "WamBamThankUMam-Alpha-0.5.apk");

            EditorUserBuildSettings.buildAppBundle = false;
            EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.Android, BuildTarget.Android);

            BuildReport report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
            {
                scenes = new[] { "Assets/Scenes/Main.unity" },
                locationPathName = outPath,
                target = BuildTarget.Android,
                options = BuildOptions.Development
            });

            if (report.summary.result != BuildResult.Succeeded)
                throw new System.Exception("Android build failed: " + report.summary.result);

            Debug.Log("Wam Bam APK built: " + outPath);
        }

        public static void BuildAndroidFromCommandLine()
        {
            BuildAndroidApk();
            EditorApplication.Exit(0);
        }
    }
}
#endif
