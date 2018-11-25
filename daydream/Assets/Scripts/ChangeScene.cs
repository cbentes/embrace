using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;


public class GameState
{
    public string environment;
    public string animal;
    public int exposure;
}

public class ChangeScene : MonoBehaviour {

    private string _url = "http://18.203.88.206/get_environment";

    void Start () {
        InvokeRepeating("RunUpdateScene", 1.0f, 1.0f);
    }

    void RunUpdateScene(){
        StartCoroutine(UpdateScene());
    }

    IEnumerator UpdateScene()
    {
        using (WWW www = new WWW(_url))
        {
            yield return www;

            if (string.IsNullOrEmpty(www.error))
            {
                string scene_state = www.text;
                Scene scene = SceneManager.GetActiveScene();
                // Debug.Log("> Current state: " + scene_state);
                // Debug.Log("> Current scene: " + scene.name);

                if (scene_state == "room" && scene.name != "RoomFear")
                {
                    // Debug.Log("> Change scene to RoomFear ...");
                    SceneManager.LoadScene("RoomFear");
                }

                if (scene_state == "animal" && scene.name != "BallFear")
                {
                    // Debug.Log("> Change scene to BallFear ...");
                    SceneManager.LoadScene("BallFear");

                }
            }
        }
    }
}
