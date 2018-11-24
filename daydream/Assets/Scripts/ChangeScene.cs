using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;


public class GameState
{
    public string command;
    public string animal;
    public int exposure;
}


public class ChangeScene : MonoBehaviour {

    // private string _url = "http://18.203.88.206/get_environment";
    private string _url = "http://127.0.0.1:5000/get_environment";

    // Use this for initialization
    void Start () {
        InvokeRepeating("UpdateScene", 1.0f, 1.0f);
    }

    IEnumerator UpdateScene()
    {
        Vector3 c = Camera.current.transform.position;
        string q = _url;
        using (WWW www = new WWW(q))
        {
            yield return www;

            if (string.IsNullOrEmpty(www.error))
            {
                string scene_state = www.text;
                Scene scene = SceneManager.GetActiveScene();
                Debug.Log("> Current state: " + scene_state);
                Debug.Log("> Current scene: " + scene.name);

                if (scene_state == "room" && scene.name != "RoomFear")
                {
                    Debug.Log("> Change scene to RoomFear ...");
                    SceneManager.LoadScene("RoomFear");
                }

                if (scene_state == "animal" && scene.name != "BallFear")
                {
                    Debug.Log("> Change scene to BallFear ...");
                    SceneManager.LoadScene("BallFear");

                }
            }
        }
    }
}
